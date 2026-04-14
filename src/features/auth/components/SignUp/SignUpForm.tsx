import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import Input from '@/components/shared/Input';
import { z } from 'zod';
import Button from '@/components/shared/Button';
import { useSignUp } from '../../api/signUp';
import { useCheckMerchantSignupStatus } from '../../api/checkMerchantSignupStatus';
import { toast } from 'sonner';
import { useAuthFlowStore } from '@/stores/AuthFlowStore';
import { useUserStore } from '@/stores/UserStore';
import {
  type MerchantFallbackSession,
  useMerchantFallbackResendOtp,
  useMerchantFallbackStart,
  useMerchantFallbackVerifyOtp,
} from '../../api/merchantFallbackRegistration';
import { useNavigate } from 'react-router-dom';

type SignUpFormData = z.infer<ReturnType<typeof createSignUpSchema>>;
type FallbackStartFormData = z.infer<ReturnType<typeof createFallbackStartSchema>>;
type FallbackOtpFormData = z.infer<ReturnType<typeof createFallbackOtpSchema>>;

type FallbackPaths = {
  startPath: string;
  verifyPath: string;
  resendPath: string;
};

type FallbackStage = 'none' | 'start' | 'otp' | 'pending';

const MAX_FALLBACK_ATTACHMENT_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_FALLBACK_ATTACHMENT_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'application/pdf',
];

const createSignUpSchema = (t: (key: string) => string) =>
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

const createFallbackStartSchema = (t: (key: string) => string) =>
  z.object({
    nationalId: createSignUpSchema(t).shape.nationalId,
    email: z
      .string()
      .min(1, t('auth.signUp.fallbackEmailRequired'))
      .email(t('auth.signUp.fallbackEmailInvalid')),
    idCardAttachment: z
      .custom<FileList>((value) => value instanceof FileList, {
        message: t('auth.signUp.fallbackAttachmentRequired'),
      })
      .refine((files) => files.length > 0, {
        message: t('auth.signUp.fallbackAttachmentRequired'),
      })
      .refine((files) => files[0].size <= MAX_FALLBACK_ATTACHMENT_SIZE_BYTES, {
        message: t('auth.signUp.fallbackAttachmentSize'),
      })
      .refine((files) => ALLOWED_FALLBACK_ATTACHMENT_TYPES.includes(files[0].type), {
        message: t('auth.signUp.fallbackAttachmentType'),
      }),
  });

const createFallbackOtpSchema = (t: (key: string) => string) =>
  z.object({
    code: z
      .string()
      .min(1, t('auth.signUp.fallbackOtpRequired'))
      .length(6, t('auth.signUp.fallbackOtpLength'))
      .regex(/^\d{6}$/, t('auth.signUp.fallbackOtpLength')),
  });

const SignUpForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setActiveStep, formData, updateFormData } = useAuthFlowStore();
  const { setUser } = useUserStore();
  const nafathPopupRef = useRef<Window | null>(null);
  const receivedCallbackRef = useRef(false);
  const [isWaitingForNafath, setIsWaitingForNafath] = useState(false);
  const [fallbackStage, setFallbackStage] = useState<FallbackStage>('none');
  const [fallbackPaths, setFallbackPaths] = useState<FallbackPaths | null>(null);
  const [fallbackSession, setFallbackSession] =
    useState<MerchantFallbackSession | null>(null);
  const [resendCountdownSeconds, setResendCountdownSeconds] = useState(0);
  const signUpSchema = createSignUpSchema(t);
  const fallbackStartSchema = createFallbackStartSchema(t);
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
    formState: { errors, isSubmitting, isValid: isSignUpFormValid },
    setValue,
    getValues,
    reset: resetSignUpForm,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
    defaultValues: {
      nationalId: formData.nationalId || '',
    },
  });
  const {
    register: registerFallbackStart,
    handleSubmit: handleFallbackStartSubmit,
    formState: {
      errors: fallbackStartErrors,
      isSubmitting: isSubmittingFallbackStart,
      isValid: isFallbackStartFormValid,
    },
    setValue: setFallbackStartValue,
    watch: watchFallbackStart,
    reset: resetFallbackStartForm,
  } = useForm<FallbackStartFormData>({
    resolver: zodResolver(fallbackStartSchema),
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

  const resetAllSignUpInputs = useCallback(() => {
    resetSignUpForm({ nationalId: '' });
    resetFallbackStartForm({ nationalId: '', email: '' });
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
    resetFallbackOtpForm,
    resetFallbackStartForm,
    resetSignUpForm,
    updateFormData,
  ]);

  const { mutate: checkMerchantSignupStatus, isPending: isCheckingStatus } =
    useCheckMerchantSignupStatus({
      onSuccess: (response) => {
        toast.success(t('auth.signUp.accountAdded'));
        setActiveStep(1);
        setUser(response.data);
        setIsWaitingForNafath(false);
        resetAllSignUpInputs();
      },
      onError: (error) => {
        console.error('Check merchant signup status error:', error);
        const errorMessage =
          error?.response?.data?.message ||
          'Sign up verification failed. Please try again.';
        toast.error(errorMessage);
        setIsWaitingForNafath(false);
      },
    });

  useEffect(() => {
    if (formData.nationalId) {
      setValue('nationalId', formData.nationalId);
      setFallbackStartValue('nationalId', formData.nationalId);
    }
  }, [formData.nationalId, setFallbackStartValue, setValue]);

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
      const data = event.data as { type?: string; payload?: unknown } | null;
      if (!data || data.type !== 'nafath.signup.callback') return;

      receivedCallbackRef.current = true;

      try {
        nafathPopupRef.current?.close();
      } catch {
        // ignore
      }

      const state = formData.nafathState;
      if (!state) {
        toast.error('Missing signup state. Please try again.');
        setIsWaitingForNafath(false);
        return;
      }

      checkMerchantSignupStatus({ state });
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [checkMerchantSignupStatus, formData.nafathState]);

  useEffect(() => {
    if (!isWaitingForNafath) return;

    receivedCallbackRef.current = false;
    const intervalId = window.setInterval(() => {
      const popup = nafathPopupRef.current;
      if (!popup) return;
      if (popup.closed) {
        nafathPopupRef.current = null;
        window.clearInterval(intervalId);

        // Nafath callback currently redirects to API and returns JSON, so we can't
        // rely on postMessage. When the user closes the popup, we verify via `state`.
        if (receivedCallbackRef.current) return;

        const state = formData.nafathState;
        if (!state) {
          toast.error('Missing signup state. Please try again.');
          setIsWaitingForNafath(false);
          return;
        }

        checkMerchantSignupStatus({ state });
      }
    }, 500);

    return () => window.clearInterval(intervalId);
  }, [checkMerchantSignupStatus, formData.nafathState, isWaitingForNafath]);

  const handleInputChange = useCallback(
    (value: string) => {
      updateFormData({ nationalId: value });
    },
    [updateFormData],
  );

  const { mutate: startFallbackRegistration, isPending: isStartingFallback } =
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
      onSuccess: () => {
        setFallbackStage('pending');
        resetAllSignUpInputs();
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
        setFallbackStage('start');
        setFallbackPaths({
          startPath: response.data.fallbackStartPath,
          verifyPath: response.data.fallbackVerifyPath,
          resendPath: response.data.fallbackResendPath,
        });
        setFallbackStartValue('nationalId', getValues('nationalId'));
        toast.info(t('auth.signUp.fallbackActivated'));
        return;
      }

      const { state, redirectUrl } = response.data;
      updateFormData({ nafathState: state, nafathRedirectUrl: redirectUrl });

      const popup = window.open(
        redirectUrl,
        'nafath-signup',
        'popup=yes,width=500,height=700',
      );

      if (!popup) {
        toast.error('Popup was blocked. Please allow popups and try again.');
        return;
      }

      nafathPopupRef.current = popup;
      setIsWaitingForNafath(true);
    },
    onError: (error) => {
      console.error('Sign up error:', error);
      const errorMessage =
        error?.response?.data?.message || 'Sign up failed. Please try again.';
      toast.error(errorMessage);
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    updateFormData({ nationalId: data.nationalId });
    mutate(data);
  };

  const onFallbackStartSubmit = (data: FallbackStartFormData) => {
    if (!fallbackPaths) {
      toast.error(t('auth.signUp.fallbackMissingPaths'));
      return;
    }

    updateFormData({ nationalId: data.nationalId });
    startFallbackRegistration({
      variant: 'registration',
      nationalId: data.nationalId,
      email: data.email,
      idCardAttachment: data.idCardAttachment[0],
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
      toast.error('Please submit again to open Nafath.');
      return;
    }

    const popup = window.open(
      redirectUrl,
      'nafath-signup',
      'popup=yes,width=500,height=700',
    );

    if (!popup) {
      toast.error('Popup was blocked. Please allow popups and try again.');
      return;
    }

    nafathPopupRef.current = popup;
    setIsWaitingForNafath(true);
  }, [formData.nafathRedirectUrl]);

  const selectedFallbackAttachmentName =
    watchFallbackStart('idCardAttachment')?.[0]?.name || '';

  if (fallbackStage === 'start') {
    return (
      <div className="flex flex-col w-full">
        <h1 className="text-[28px] font-bold mb-2">{t('auth.signUp.fallbackTitle')}</h1>
        <p className="text-sm text-gray-600 mb-6">
          {t('auth.signUp.fallbackDescription')}
        </p>

        <form
          onSubmit={handleFallbackStartSubmit(onFallbackStartSubmit)}
          className="flex flex-col w-full"
        >
          <div className="flex flex-col w-full mb-4">
            <Input
              {...registerFallbackStart('nationalId', {
                onChange: (e) => handleInputChange(e.target.value),
              })}
              label={t('common.fields.identificationNumber')}
              placeholder={t('common.fields.identificationNumberPlaceholder')}
              type="text"
              id="fallback-national-id"
              helperText={t('common.fields.identificationNumberHelper')}
              error={fallbackStartErrors.nationalId?.message}
              disabled={isStartingFallback}
            />
          </div>

          <div className="flex flex-col w-full mb-4">
            <Input
              {...registerFallbackStart('email')}
              label={t('common.fields.email')}
              placeholder="merchant@example.com"
              type="email"
              id="fallback-email"
              error={fallbackStartErrors.email?.message}
              disabled={isStartingFallback}
            />
          </div>

          <div className="flex flex-col w-full mb-6">
            <label htmlFor="fallback-id-attachment" className="text-sm text-gray-700 mb-2">
              {t('auth.signUp.fallbackAttachmentLabel')}
            </label>
            <input
              {...registerFallbackStart('idCardAttachment')}
              id="fallback-id-attachment"
              type="file"
              accept={ALLOWED_FALLBACK_ATTACHMENT_TYPES.join(',')}
              className="w-full p-2 border border-gray-300 rounded-lg h-12 focus:outline-none focus:ring-0 focus:border-2 focus:border-primary focus:ring-primary focus:ring-opacity-50 file:mr-3 file:px-3 file:py-1 file:rounded-md file:border-0 file:bg-gray-100 file:text-gray-700"
              disabled={isStartingFallback}
            />
            {selectedFallbackAttachmentName && !fallbackStartErrors.idCardAttachment && (
              <p className="text-xs text-gray-500 mt-2">
                {t('auth.signUp.fallbackAttachmentSelected', {
                  fileName: selectedFallbackAttachmentName,
                })}
              </p>
            )}
            {fallbackStartErrors.idCardAttachment?.message ? (
              <span className="text-sm text-red-500 mt-1">
                {fallbackStartErrors.idCardAttachment?.message}
              </span>
            ) : (
              <span className="text-sm text-gray-700 mt-2 bg-[#E6EAEE40] rounded-lg p-2">
                {t('auth.signUp.fallbackAttachmentHelper')}
              </span>
            )}
          </div>

          <Button
            type="submit"
            className="w-full p-2 bg-primary text-white rounded-lg h-12 cursor-pointer hover:bg-primary/90 transition-all duration-150 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            text={t('auth.signUp.fallbackSubmit')}
            isLoading={isSubmittingFallbackStart || isStartingFallback}
            disabled={
              isSubmittingFallbackStart ||
              isStartingFallback ||
              !isFallbackStartFormValid
            }
          />
        </form>
      </div>
    );
  }

  if (fallbackStage === 'otp') {
    return (
      <div className="flex flex-col w-full">
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
              id="fallback-otp"
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

  if (fallbackStage === 'pending') {
    return (
      <div className="flex flex-col w-full">
        <h1 className="text-[28px] font-bold mb-2">
          {t('auth.signUp.fallbackPendingTitle')}
        </h1>
        <p className="text-sm text-gray-600 mb-8">
          {t('auth.signUp.fallbackPendingDescription')}
        </p>
        <Button
          type="button"
          variant="primary"
          className="w-full h-12"
          text={t('auth.signUp.goToLogin')}
          onClick={() => {
            resetAllSignUpInputs();
            navigate('/auth/login');
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-[28px] font-bold mb-4">{t('auth.signUp.title')}</h1>

      {(isWaitingForNafath || isCheckingStatus) && (
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
      )}
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
          text={t('common.buttons.signUp')}
          isLoading={
            isSubmitting || isPending || isWaitingForNafath || isCheckingStatus
          }
          disabled={
            isSubmitting ||
            isPending ||
            isWaitingForNafath ||
            isCheckingStatus ||
            !isSignUpFormValid
          }
        />
      </form>
    </div>
  );
};

export default SignUpForm;
