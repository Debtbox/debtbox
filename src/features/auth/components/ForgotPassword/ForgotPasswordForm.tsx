import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import Input from '@/components/shared/Input';
import { z } from 'zod';
import Button from '@/components/shared/Button';
import { useSignUp } from '../../api/signUp';
import { useCheckMerchantSignupStatus } from '../../api/checkMerchantSignupStatus';
import { toast } from '@/lib/toast';
import { useAuthFlowStore } from '@/stores/AuthFlowStore';
import { useUserStore } from '@/stores/UserStore';
import type { UserDto } from '@/types/UserDto';
import {
  type MerchantFallbackSession,
  useMerchantFallbackResendOtp,
  useMerchantFallbackStart,
  useMerchantFallbackVerifyOtp,
} from '../../api/merchantFallbackRegistration';

type ForgotPasswordFormData = z.infer<ReturnType<typeof createForgotPasswordSchema>>;
type FallbackEmailFormData = z.infer<ReturnType<typeof createFallbackEmailSchema>>;
type FallbackOtpFormData = z.infer<ReturnType<typeof createFallbackOtpSchema>>;

type FallbackPaths = {
  startPath: string;
  verifyPath: string;
  resendPath: string;
};

type FallbackStage = 'none' | 'email' | 'otp';

const createForgotPasswordSchema = (t: (key: string) => string) =>
  z.object({
    nationalId: z
      .string()
      .min(1, t('common.validation.identificationNumberRequired'))
      .length(10, t('common.validation.identificationNumberLength'))
      .regex(/^[1-3]\d{9}$/, t('common.validation.identificationNumberFormat'))
      .refine((val) => {
        const firstDigit = parseInt(val[0]);
        return [1, 2, 3].includes(firstDigit);
      }, t('common.validation.identificationNumberType')),
  });

const createFallbackEmailSchema = (t: (key: string) => string) =>
  z.object({
    nationalId: createForgotPasswordSchema(t).shape.nationalId,
    email: z
      .string()
      .min(1, t('auth.signUp.fallbackEmailRequired'))
      .email(t('auth.signUp.fallbackEmailInvalid')),
  });

const createFallbackOtpSchema = (t: (key: string) => string) =>
  z.object({
    code: z
      .string()
      .min(1, t('auth.signUp.fallbackOtpRequired'))
      .length(6, t('auth.signUp.fallbackOtpLength'))
      .regex(/^\d{6}$/, t('auth.signUp.fallbackOtpLength')),
  });

type ForgotPasswordFormProps = {
  onNafathSuccess: () => void;
};

const buildMerchantUserFromPasswordResetVerify = (
  data: {
    accountId: number;
    accessToken?: string;
  },
  commercialRegister: string,
): UserDto | null => {
  if (!data.accessToken) return null;
  return {
    id: data.accountId,
    national_id: commercialRegister,
    iqama_id: commercialRegister,
    commercial_register_number: commercialRegister,
    accessToken: data.accessToken,
    full_name_ar: '',
    full_name_en: '',
    nationality: '',
    dob: '',
    businesses: [],
    appActor: 'MERCHANT',
  };
};

const ForgotPasswordForm = ({ onNafathSuccess }: ForgotPasswordFormProps) => {
  const { t } = useTranslation();
  const { formData, updateFormData } = useAuthFlowStore();
  const { setUser } = useUserStore();
  const nafathPopupRef = useRef<Window | null>(null);
  const receivedCallbackRef = useRef(false);
  const passwordResetCommercialRegisterRef = useRef('');
  const [isWaitingForNafath, setIsWaitingForNafath] = useState(false);
  const [fallbackStage, setFallbackStage] = useState<FallbackStage>('none');
  const [fallbackPaths, setFallbackPaths] = useState<FallbackPaths | null>(null);
  const [fallbackSession, setFallbackSession] =
    useState<MerchantFallbackSession | null>(null);
  const [resendCountdownSeconds, setResendCountdownSeconds] = useState(0);

  const forgotPasswordSchema = createForgotPasswordSchema(t);
  const fallbackEmailSchema = createFallbackEmailSchema(t);
  const fallbackOtpSchema = createFallbackOtpSchema(t);

  const getResendCooldownSeconds = useCallback((session: MerchantFallbackSession) => {
    const resendDate = new Date(session.resendAvailableAt).getTime();
    if (!Number.isFinite(resendDate)) return 0;
    const remainingMs = resendDate - Date.now();
    return remainingMs > 0 ? Math.ceil(remainingMs / 1000) : 0;
  }, []);

  const applyFallbackSession = useCallback(
    (session: MerchantFallbackSession) => {
      setFallbackSession(session);
      setResendCountdownSeconds(getResendCooldownSeconds(session));
    },
    [getResendCooldownSeconds],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid: isInitialFormValid },
    setValue,
    getValues,
    reset: resetInitialForm,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      nationalId: formData.nationalId || '',
    },
  });

  const {
    register: registerFallbackEmail,
    handleSubmit: handleFallbackEmailSubmit,
    formState: {
      errors: fallbackEmailErrors,
      isSubmitting: isSubmittingFallbackEmail,
      isValid: isFallbackEmailFormValid,
    },
    setValue: setFallbackEmailValue,
    reset: resetFallbackEmailForm,
  } = useForm<FallbackEmailFormData>({
    resolver: zodResolver(fallbackEmailSchema),
    mode: 'onChange',
    defaultValues: {
      nationalId: formData.nationalId || '',
      email: '',
    },
  });

  const {
    register: registerFallbackOtp,
    handleSubmit: handleFallbackOtpSubmit,
    formState: {
      errors: fallbackOtpErrors,
      isSubmitting: isSubmittingFallbackOtp,
      isValid: isFallbackOtpFormValid,
    },
    reset: resetFallbackOtpForm,
  } = useForm<FallbackOtpFormData>({
    resolver: zodResolver(fallbackOtpSchema),
    mode: 'onChange',
    defaultValues: {
      code: '',
    },
  });

  const resetAllForgotPasswordInputs = useCallback(() => {
    passwordResetCommercialRegisterRef.current = '';
    resetInitialForm({ nationalId: '' });
    resetFallbackEmailForm({ nationalId: '', email: '' });
    resetFallbackOtpForm({ code: '' });
    setFallbackSession(null);
    setFallbackPaths(null);
    setResendCountdownSeconds(0);
    updateFormData({
      nationalId: undefined,
      nafathRedirectUrl: undefined,
      nafathState: undefined,
    });
  }, [
    resetFallbackEmailForm,
    resetFallbackOtpForm,
    resetInitialForm,
    updateFormData,
  ]);

  const { mutate: checkMerchantSignupStatus, isPending: isCheckingStatus } =
    useCheckMerchantSignupStatus({
      onSuccess: (response) => {
        toast.success(t('auth.forgotPassword.verificationSuccess'));
        setUser(response.data);
        setIsWaitingForNafath(false);
        resetAllForgotPasswordInputs();
        onNafathSuccess();
      },
      onError: (error) => {
        console.error('Check merchant signup status error:', error);
        const errorMessage =
          error?.response?.data?.message ||
          t('auth.forgotPassword.verificationFailed');
        toast.error(errorMessage);
        setIsWaitingForNafath(false);
      },
    });

  useEffect(() => {
    if (formData.nationalId) {
      setValue('nationalId', formData.nationalId);
      setFallbackEmailValue('nationalId', formData.nationalId);
    }
  }, [formData.nationalId, setFallbackEmailValue, setValue]);

  useEffect(() => {
    if (resendCountdownSeconds <= 0) return;

    const timerId = window.setInterval(() => {
      setResendCountdownSeconds((previous) => Math.max(previous - 1, 0));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [resendCountdownSeconds]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data as { type?: string } | null;
      if (!data || data.type !== 'nafath.signup.callback') return;

      receivedCallbackRef.current = true;
      try {
        nafathPopupRef.current?.close();
      } catch {
        // ignore
      }

      const state = formData.nafathState;
      if (!state) {
        toast.error(t('auth.forgotPassword.missingState'));
        setIsWaitingForNafath(false);
        return;
      }
      checkMerchantSignupStatus({ state });
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [checkMerchantSignupStatus, formData.nafathState, t]);

  useEffect(() => {
    if (!isWaitingForNafath) return;

    receivedCallbackRef.current = false;
    const intervalId = window.setInterval(() => {
      const popup = nafathPopupRef.current;
      if (!popup) return;
      if (popup.closed) {
        nafathPopupRef.current = null;
        window.clearInterval(intervalId);
        if (receivedCallbackRef.current) return;

        const state = formData.nafathState;
        if (!state) {
          toast.error(t('auth.forgotPassword.missingState'));
          setIsWaitingForNafath(false);
          return;
        }
        checkMerchantSignupStatus({ state });
      }
    }, 500);

    return () => window.clearInterval(intervalId);
  }, [checkMerchantSignupStatus, formData.nafathState, isWaitingForNafath, t]);

  const handleInputChange = useCallback(
    (value: string) => {
      updateFormData({ nationalId: value });
    },
    [updateFormData],
  );

  const { mutate: startFallbackReset, isPending: isStartingFallback } =
    useMerchantFallbackStart({
      onSuccess: (response) => {
        applyFallbackSession(response.data);
        setFallbackStage('otp');
        toast.success(t('auth.signUp.fallbackOtpSent'));
      },
      onError: (error) => {
        const errorMessage =
          error?.response?.data?.message || t('auth.signUp.fallbackStartFailed');
        toast.error(errorMessage);
      },
    });

  const { mutate: resendFallbackOtp, isPending: isResendingFallbackOtp } =
    useMerchantFallbackResendOtp({
      onSuccess: (response) => {
        applyFallbackSession(response.data);
        toast.success(t('auth.signUp.fallbackOtpResent'));
      },
      onError: (error) => {
        const errorMessage =
          error?.response?.data?.message || t('auth.signUp.fallbackResendFailed');
        toast.error(errorMessage);
      },
    });

  const { mutate: verifyFallbackOtp, isPending: isVerifyingFallbackOtp } =
    useMerchantFallbackVerifyOtp({
      onSuccess: (response) => {
        const commercialRegister = passwordResetCommercialRegisterRef.current;
        const user = buildMerchantUserFromPasswordResetVerify(
          response.data,
          commercialRegister,
        );
        if (!user) {
          toast.error(t('auth.forgotPassword.fallbackMissingAccessToken'));
          return;
        }
        setUser(user);
        setFallbackStage('none');
        resetAllForgotPasswordInputs();
        toast.success(t('auth.forgotPassword.verificationSuccess'));
        onNafathSuccess();
      },
      onError: (error) => {
        const errorMessage =
          error?.response?.data?.message || t('auth.signUp.fallbackVerifyFailed');
        toast.error(errorMessage);
      },
    });

  const { mutate, isPending } = useSignUp({
    onSuccess: (response) => {
      if ('fallbackRequired' in response.data && response.data.fallbackRequired) {
        if (response.data.actorType !== 'MERCHANT') {
          toast.error(t('auth.signUp.fallbackUnsupportedActor'));
          return;
        }

        setIsWaitingForNafath(false);
        setFallbackStage('email');
        setFallbackPaths({
          startPath: response.data.fallbackStartPath,
          verifyPath: response.data.fallbackVerifyPath,
          resendPath: response.data.fallbackResendPath,
        });
        const cr = getValues('nationalId');
        passwordResetCommercialRegisterRef.current = cr;
        setFallbackEmailValue('nationalId', cr);
        toast.info(t('auth.forgotPassword.fallbackActivated'));
        return;
      }

      const { state, redirectUrl } = response.data;
      updateFormData({ nafathState: state, nafathRedirectUrl: redirectUrl });

      const popup = window.open(
        redirectUrl,
        'nafath-forgot-password',
        'popup=yes,width=500,height=700',
      );

      if (!popup) {
        toast.error(t('auth.forgotPassword.popupBlocked'));
        return;
      }

      nafathPopupRef.current = popup;
      setIsWaitingForNafath(true);
    },
    onError: (error) => {
      console.error('Forgot password / signup error:', error);
      const errorMessage =
        error?.response?.data?.message || t('auth.forgotPassword.requestFailed');
      toast.error(errorMessage);
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    updateFormData({ nationalId: data.nationalId });
    mutate({ nationalId: data.nationalId, isForgetPassword: true });
  };

  const onFallbackEmailSubmit = (data: FallbackEmailFormData) => {
    if (!fallbackPaths) {
      toast.error(t('auth.signUp.fallbackMissingPaths'));
      return;
    }

    updateFormData({ nationalId: data.nationalId });
    passwordResetCommercialRegisterRef.current = data.nationalId;
    startFallbackReset({
      variant: 'password_reset',
      commercialRegister: data.nationalId,
      email: data.email,
      startPath: fallbackPaths.startPath,
    });
  };

  const onFallbackOtpSubmit = (data: FallbackOtpFormData) => {
    if (!fallbackPaths || !fallbackSession) {
      toast.error(t('auth.signUp.fallbackMissingSession'));
      return;
    }

    verifyFallbackOtp({
      sessionId: fallbackSession.sessionId,
      code: data.code,
      verifyPath: fallbackPaths.verifyPath,
    });
  };

  const onFallbackResendOtp = () => {
    if (!fallbackPaths || !fallbackSession) {
      toast.error(t('auth.signUp.fallbackMissingSession'));
      return;
    }

    resendFallbackOtp({
      sessionId: fallbackSession.sessionId,
      resendPath: fallbackPaths.resendPath,
    });
  };

  const openNafathPopupAgain = useCallback(() => {
    const redirectUrl = formData.nafathRedirectUrl;
    if (!redirectUrl) {
      toast.error(t('auth.forgotPassword.submitAgain'));
      return;
    }
    const popup = window.open(
      redirectUrl,
      'nafath-forgot-password',
      'popup=yes,width=500,height=700',
    );
    if (!popup) {
      toast.error(t('auth.forgotPassword.popupBlocked'));
      return;
    }
    nafathPopupRef.current = popup;
    setIsWaitingForNafath(true);
  }, [formData.nafathRedirectUrl, t]);

  const waitingOverlay = (isWaitingForNafath || isCheckingStatus) && (
    <div className="fixed inset-0 z-70 flex items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-71 w-full max-w-md mx-4 rounded-xl bg-white shadow-xl border border-[#E6EAEE] p-6">
        <div className="flex items-start gap-3">
          <div className="mt-1 w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <div className="flex-1">
            <p className="text-lg font-semibold text-gray-900">
              {isCheckingStatus
                ? t('auth.signUp.verifyingNafathTitle')
                : t('auth.signUp.waitingForNafathTitle')}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {isCheckingStatus
                ? t('auth.signUp.verifyingNafathDescription')
                : t('auth.signUp.waitingForNafathDescription')}
            </p>
            {!isCheckingStatus && (
              <div className="mt-4 flex flex-col gap-2">
                <Button
                  type="button"
                  variant="primary"
                  className="w-full h-11"
                  text={t('auth.signUp.openNafathAgain')}
                  onClick={openNafathPopupAgain}
                />
                <Button
                  type="button"
                  variant="gray"
                  className="w-full h-11"
                  text={t('common.buttons.cancel')}
                  onClick={() => {
                    try {
                      nafathPopupRef.current?.close();
                    } catch {
                      // ignore
                    }
                    nafathPopupRef.current = null;
                    setIsWaitingForNafath(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (fallbackStage === 'email') {
    return (
      <div className="flex flex-col w-full">
        {waitingOverlay}
        <h1 className="text-[28px] font-bold mb-2">
          {t('auth.forgotPassword.fallbackEmailTitle')}
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          {t('auth.forgotPassword.fallbackEmailDescription')}
        </p>

        <form
          onSubmit={handleFallbackEmailSubmit(onFallbackEmailSubmit)}
          className="flex flex-col w-full"
        >
          <div className="flex flex-col w-full mb-4">
            <Input
              {...registerFallbackEmail('nationalId', {
                onChange: (e) => handleInputChange(e.target.value),
              })}
              label={t('common.fields.identificationNumber')}
              placeholder={t('common.fields.identificationNumberPlaceholder')}
              type="text"
              id="forgot-fallback-national-id"
              helperText={t('common.fields.identificationNumberHelper')}
              error={fallbackEmailErrors.nationalId?.message}
              disabled={isStartingFallback}
            />
          </div>

          <div className="flex flex-col w-full mb-6">
            <Input
              {...registerFallbackEmail('email')}
              label={t('common.fields.email')}
              placeholder="merchant@example.com"
              type="email"
              id="forgot-fallback-email"
              error={fallbackEmailErrors.email?.message}
              disabled={isStartingFallback}
            />
          </div>

          <Button
            type="submit"
            className="w-full p-2 bg-primary text-white rounded-lg h-12 cursor-pointer hover:bg-primary/90 transition-all duration-150 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            text={t('common.buttons.next')}
            isLoading={isSubmittingFallbackEmail || isStartingFallback}
            disabled={
              isSubmittingFallbackEmail ||
              isStartingFallback ||
              !isFallbackEmailFormValid
            }
          />
        </form>
      </div>
    );
  }

  if (fallbackStage === 'otp') {
    return (
      <div className="flex flex-col w-full">
        {waitingOverlay}
        <h1 className="text-[28px] font-bold mb-2">{t('auth.signUp.fallbackOtpTitle')}</h1>
        <p className="text-sm text-gray-600 mb-2">
          {t('auth.signUp.fallbackOtpDescription')}
        </p>
        {fallbackSession?.email && (
          <p className="text-sm text-gray-700 font-medium mb-6">{fallbackSession.email}</p>
        )}

        <form
          onSubmit={handleFallbackOtpSubmit(onFallbackOtpSubmit)}
          className="flex flex-col w-full"
        >
          <div className="flex flex-col w-full mb-6">
            <Input
              {...registerFallbackOtp('code')}
              label={t('auth.signUp.fallbackOtpLabel')}
              placeholder="123456"
              type="text"
              id="forgot-fallback-otp"
              maxLength={6}
              error={fallbackOtpErrors.code?.message}
              disabled={isVerifyingFallbackOtp}
            />
          </div>

          <Button
            type="submit"
            className="w-full p-2 bg-primary text-white rounded-lg h-12 cursor-pointer hover:bg-primary/90 transition-all duration-150 mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
            text={t('auth.signUp.fallbackVerifyOtp')}
            isLoading={isSubmittingFallbackOtp || isVerifyingFallbackOtp}
            disabled={
              isVerifyingFallbackOtp ||
              isSubmittingFallbackOtp ||
              !isFallbackOtpFormValid
            }
          />
        </form>

        <Button
          type="button"
          variant="gray"
          className="w-full h-12"
          text={
            resendCountdownSeconds > 0
              ? t('auth.signUp.fallbackResendIn', { seconds: resendCountdownSeconds })
              : t('auth.signUp.fallbackResendOtp')
          }
          onClick={onFallbackResendOtp}
          disabled={resendCountdownSeconds > 0 || isResendingFallbackOtp}
          isLoading={isResendingFallbackOtp}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-[28px] font-bold mb-4">{t('auth.forgotPassword.title')}</h1>
      <p className="text-sm text-gray-600 mb-4">
        {t('auth.forgotPassword.description')}
      </p>

      {waitingOverlay}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full">
        <div className="flex flex-col w-full mb-4">
          <Input
            {...register('nationalId', {
              onChange: (e) => handleInputChange(e.target.value),
            })}
            label={t('common.fields.identificationNumber')}
            placeholder={t('common.fields.identificationNumberPlaceholder')}
            type="text"
            id="national-id"
            helperText={t('common.fields.identificationNumberHelper')}
            error={errors.nationalId?.message}
            disabled={isWaitingForNafath || isCheckingStatus}
          />
        </div>
        <Button
          type="submit"
          className="w-full p-2 bg-primary text-white rounded-lg h-12 cursor-pointer hover:bg-primary/90 transition-all duration-150 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          text={t('common.buttons.next')}
          isLoading={
            isSubmitting || isPending || isWaitingForNafath || isCheckingStatus
          }
          disabled={
            isSubmitting ||
            isPending ||
            isWaitingForNafath ||
            isCheckingStatus ||
            !isInitialFormValid
          }
        />
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
