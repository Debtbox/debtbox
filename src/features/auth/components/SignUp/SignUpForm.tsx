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

type SignUpFormData = z.infer<ReturnType<typeof createSignUpSchema>>;

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

const SignUpForm = () => {
  const { t } = useTranslation();
  const { setActiveStep, formData, updateFormData } = useAuthFlowStore();
  const { setUser } = useUserStore();
  const nafathPopupRef = useRef<Window | null>(null);
  const receivedCallbackRef = useRef(false);
  const [isWaitingForNafath, setIsWaitingForNafath] = useState(false);
  const signUpSchema = createSignUpSchema(t);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      nationalId: formData.nationalId || '',
    },
  });

  const { mutate: checkMerchantSignupStatus, isPending: isCheckingStatus } =
    useCheckMerchantSignupStatus({
      onSuccess: (response) => {
        toast.success(t('auth.signUp.accountAdded'));
        setActiveStep(1);
        setUser(response.data);
        setIsWaitingForNafath(false);
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
    }
  }, [formData.nationalId, setValue]);

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

  const { mutate, isPending } = useSignUp({
    onSuccess: (response) => {
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
        />
      </form>
    </div>
  );
};

export default SignUpForm;
