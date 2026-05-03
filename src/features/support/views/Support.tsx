import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Settings } from 'lucide-react';
import { cn } from '@/utils/cn';

const MenuItem = ({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    className={cn(
      'w-full flex items-center justify-between px-1 py-5 border-b border-gray-100 last:border-0 transition-colors duration-150 text-start',
      disabled
        ? 'opacity-40 cursor-not-allowed'
        : 'hover:bg-gray-50 cursor-pointer',
    )}
  >
    <span className="text-sm font-semibold text-gray-900">{label}</span>
    <ChevronRight className="w-4 h-4 text-gray-400 shrink-0 rtl:rotate-180" />
  </button>
);

export const Support = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center gap-2 mb-6 text-sm">
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span>{t('profile.settings.title', 'Settings')}</span>
        </button>
        <span className="text-gray-300">/</span>
        <span className="font-bold text-gray-900">
          {t('support.title', 'Help and support')}
        </span>
      </div>

      <div className="bg-white rounded-2xl px-6 py-2">
        <MenuItem
          label={t('support.faqs', 'FAQs')}
          disabled
        />
        <MenuItem
          label={t('support.contactSupport', 'Contact Support')}
          onClick={() => navigate('/support/contact')}
        />
        <MenuItem
          label={t('support.howItWorks', 'How it works')}
          disabled
        />
      </div>
    </div>
  );
};
