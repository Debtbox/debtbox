import { useGetMerchantProfile } from '@/features/auth/api/getMerchantProfile';
import { useTranslation } from 'react-i18next';

const ProfileSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6 animate-pulse">
    <div className="h-6 w-32 bg-gray-200 rounded" />
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="h-5 w-40 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  </div>
);

export const Profile = () => {
  const { t } = useTranslation();

  const { data, isLoading } = useGetMerchantProfile({});

  if (isLoading) return <ProfileSkeleton />;

  const profile = data?.data;

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">
          {t('profile.title', 'Profile')}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {t('profile.description', 'Your account information')}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              {t('profile.fields.fullNameEn', 'Full Name (EN)')}
            </p>
            <p className="text-sm font-medium text-gray-800">
              {profile?.full_name_en || '—'}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              {t('profile.fields.fullNameAr', 'Full Name (AR)')}
            </p>
            <p className="text-sm font-medium text-gray-800">
              {profile?.full_name_ar || '—'}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              {t('profile.fields.email', 'Email')}
            </p>
            <p className="text-sm font-medium text-gray-800">
              {profile?.email || '—'}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              {t('profile.fields.phoneNumber', 'Phone Number')}
            </p>
            <p className="text-sm font-medium text-gray-800">
              {profile?.phone_number || '—'}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-gray-400 uppercase tracking-wide">
              {t('profile.fields.iban', 'IBAN')}
            </p>
            <p className="text-sm font-medium text-gray-800 font-mono">
              {profile?.iban || '—'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
