import { Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type PasswordValidationStepsProps = {
  password: string;
};

export const PasswordValidationSteps = ({ password }: PasswordValidationStepsProps) => {
  const { t } = useTranslation();

  const validations = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[^A-Za-z0-9]/.test(password),
  };

  const steps = [
    { key: 'minLength', label: t('common.validation.passwordMinLength'), met: validations.minLength },
    { key: 'hasUppercase', label: t('common.validation.passwordUppercase'), met: validations.hasUppercase },
    { key: 'hasLowercase', label: t('common.validation.passwordLowercase'), met: validations.hasLowercase },
    { key: 'hasNumber', label: t('common.validation.passwordNumber'), met: validations.hasNumber },
    { key: 'hasSpecialChar', label: t('common.validation.passwordSpecialChar'), met: validations.hasSpecialChar },
  ];

  const metCount = steps.filter((s) => s.met).length;
  const total = steps.length;

  const strengthLabel =
    metCount === 0 ? null
    : metCount <= 2 ? t('common.validation.passwordWeak')
    : metCount <= 3 ? t('common.validation.passwordFair')
    : metCount <= 4 ? t('common.validation.passwordGood')
    : t('common.validation.passwordStrong');

  const strengthColor =
    metCount <= 2 ? 'bg-red-500'
    : metCount <= 3 ? 'bg-amber-400'
    : metCount <= 4 ? 'bg-blue-500'
    : 'bg-emerald-500';

  const strengthTextColor =
    metCount <= 2 ? 'text-red-600'
    : metCount <= 3 ? 'text-amber-600'
    : metCount <= 4 ? 'text-blue-600'
    : 'text-emerald-600';

  return (
    <div className="mt-3 space-y-3">
      {/* Strength bar */}
      <div className="space-y-1.5">
        <div className="flex gap-1">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i < metCount ? strengthColor : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        {strengthLabel && (
          <p className={`text-xs font-medium ${strengthTextColor}`}>{strengthLabel}</p>
        )}
      </div>

      {/* Requirements grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {steps.map((step) => (
          <div key={step.key} className="flex items-center gap-1.5">
            <div
              className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center transition-all duration-200 ${
                step.met ? 'bg-emerald-500' : 'bg-gray-200'
              }`}
            >
              {step.met
                ? <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                : <X className="w-2.5 h-2.5 text-gray-400" strokeWidth={3} />
              }
            </div>
            <span
              className={`text-xs transition-colors duration-200 ${
                step.met ? 'text-gray-700' : 'text-gray-400'
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
