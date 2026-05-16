import { useGetMerchantProfile } from '@/features/auth/api/getMerchantProfile';
import { useUserStore } from '@/stores/UserStore';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Mail,
  Phone,
  Landmark,
  Settings as SettingsIcon,
  // Bell,
  // ShieldCheck,
  // CreditCard,
  Headphones,
  LogOut,
  Wallet,
} from 'lucide-react';
import MaskIconTop from '@/features/dashboard/components/icons/MaskIconTop';
import MaskIconBottom from '@/features/dashboard/components/icons/MaskIconBottom';
import { clearCookie } from '@/utils/storage';
import { cn } from '@/utils/cn';

const ProfileSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-2 rounded-2xl bg-gray-200 h-56" />
      <div className="lg:col-span-3 bg-white rounded-2xl p-6 space-y-4">
        <div className="h-5 w-40 bg-gray-200 rounded" />
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0"
          >
            <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0" />
            <div className="flex-1 space-y-1">
              <div className="h-3 w-20 bg-gray-200 rounded" />
              <div className="h-4 w-44 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="bg-white rounded-2xl px-6 pt-6 pb-2 space-y-1">
      <div className="h-5 w-24 bg-gray-200 rounded mb-4" />
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0"
        >
          <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
          <div className="flex-1 space-y-1">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-3 w-48 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Avatar = ({ name, className }: { name?: string; className?: string }) => {
  const initials = name
    ? name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase()
    : '?';
  return (
    <div
      className={cn(
        'rounded-full bg-white/20 flex items-center justify-center text-white font-bold select-none',
        className,
      )}
    >
      {initials}
    </div>
  );
};

const HeroCard = ({
  name,
  email,
  storesCount,
}: {
  name: string;
  email: string;
  storesCount: number;
}) => {
  const { t } = useTranslation();
  return (
    <div className="relative rounded-2xl bg-linear-to-b from-[#001DB2] to-[#0B1B6A] overflow-hidden p-6 flex flex-col justify-between min-h-55 h-full">
      <MaskIconTop className="absolute top-0 left-0" />
      <MaskIconBottom className="absolute bottom-0 right-0" />

      <div className="relative z-10 flex items-center gap-4">
        <Avatar name={name} className="w-16 h-16 text-xl shrink-0" />
        <div className="min-w-0">
          <h2 className="text-white font-bold text-xl truncate">{name}</h2>
          <p className="text-white/60 text-sm truncate">{email}</p>
        </div>
      </div>

      <div className="relative z-10 flex items-center mt-8">
        <div className="flex-1 text-center">
          <p className="text-white font-bold text-2xl">{storesCount}</p>
          <p className="text-white/60 text-xs mt-1">
            {t('profile.hero.stores', 'Stores')}
          </p>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
    <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-900 truncate">
        {value || '—'}
      </p>
    </div>
    <ChevronRight className="w-4 h-4 text-gray-300 shrink-0 rtl:rotate-180" />
  </div>
);

const SettingsRow = ({
  icon,
  iconBg,
  iconColor,
  title,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  onClick?: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full flex items-center gap-4 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors duration-150 text-start"
  >
    <div
      className={cn(
        'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
        iconBg,
        iconColor,
      )}
    >
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-gray-900">{title}</p>
      <p className="text-xs text-gray-400 mt-0.5">{description}</p>
    </div>
    <ChevronRight className="w-4 h-4 text-gray-300 shrink-0 rtl:rotate-180" />
  </button>
);

export const Profile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, clearUser } = useUserStore();

  const { data, isLoading } = useGetMerchantProfile({});

  const profile = data?.data;
  const displayName = profile?.full_name_en || user?.full_name_en || '—';
  const email = profile?.email || '—';
  const phone = profile?.phone_number || '—';
  const iban = profile?.iban || '—';
  const storesCount = user?.businesses?.length ?? 0;

  const handleLogout = () => {
    clearUser();
    clearCookie('access_token');
    navigate('/auth/login', { replace: true });
  };

  const settingsItems = [
    {
      icon: <SettingsIcon className="w-5 h-5" />,
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-500',
      title: t('profile.settings.accountSettings', 'Account Settings'),
      description: t(
        'profile.settings.accountSettingsDesc',
        'Manage your account details',
      ),
      onClick: () => navigate('/settings'),
    },
    {
      icon: <Wallet className="w-5 h-5" />,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-500',
      title: t('profile.settings.outstandingFees', 'Outstanding Fees'),
      description: t(
        'profile.settings.outstandingFeesDesc',
        'View your outstanding platform fees',
      ),
      onClick: () => navigate('/settings/outstanding-fees'),
    },
    // {
    //   icon: <Bell className="w-5 h-5" />,
    //   iconBg: 'bg-amber-100',
    //   iconColor: 'text-amber-500',
    //   title: t('profile.settings.notifications', 'Notifications'),
    //   description: t(
    //     'profile.settings.notificationsDesc',
    //     'Manage your Notifications',
    //   ),
    //   onClick: () => navigate('/notifications'),
    // },
    // {
    //   icon: <ShieldCheck className="w-5 h-5" />,
    //   iconBg: 'bg-red-100',
    //   iconColor: 'text-red-400',
    //   title: t('profile.settings.security', 'Security'),
    //   description: t(
    //     'profile.settings.securityDesc',
    //     'Manage your passwords, login activity.. etc',
    //   ),
    // },
    // {
    //   icon: <CreditCard className="w-5 h-5" />,
    //   iconBg: 'bg-sky-100',
    //   iconColor: 'text-sky-500',
    //   title: t('profile.settings.paymentMethods', 'Payment methods'),
    //   description: t(
    //     'profile.settings.paymentMethodsDesc',
    //     'Manage your Saved cards',
    //   ),
    // },
    {
      icon: <Headphones className="w-5 h-5" />,
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-500',
      title: t('profile.settings.helpSupport', 'Help and Support'),
      description: t(
        'profile.settings.helpSupportDesc',
        'FAQs, Contact support',
      ),
      onClick: () => navigate('/support'),
    },
    {
      icon: <LogOut className="w-5 h-5" />,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-500',
      title: t('profile.settings.logout', 'Logout'),
      description: t('profile.settings.logoutDesc', 'Sign out of your account'),
      onClick: handleLogout,
    },
  ];

  if (isLoading) return <ProfileSkeleton />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <HeroCard
            name={displayName}
            email={email}
            storesCount={storesCount}
          />
        </div>

        <div className="lg:col-span-3 bg-white rounded-2xl p-6">
          <h3 className="text-base font-bold text-gray-900 mb-1">
            {t('profile.personalInfo.title', 'Personal Information')}
          </h3>
          <div>
            <InfoRow
              icon={<Mail className="w-4 h-4" />}
              label={t('profile.personalInfo.email', 'Email')}
              value={email}
            />
            <InfoRow
              icon={<Phone className="w-4 h-4" />}
              label={t('profile.personalInfo.mobile', 'Mobile number')}
              value={phone}
            />
            <InfoRow
              icon={<Landmark className="w-4 h-4" />}
              label={t('profile.personalInfo.iban', 'IBAN')}
              value={iban}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl px-6 pt-6 pb-2">
        <h3 className="text-base font-bold text-gray-900 mb-1">
          {t('profile.settings.title', 'Settings')}
        </h3>
        <div>
          {settingsItems.map((item) => (
            <SettingsRow key={item.title} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
};
