import { useTranslation } from 'react-i18next';
import BurgerIcon from '../icons/BurgerIcon';
import { useUserStore } from '@/stores/UserStore';
import UserDropdown from './UserDropdown';
import BusinessDropdown from '../shared/BusinessDropdown';
import {
  NotificationDropdown,
  useGetUnreadNotificationsCountData,
} from '@/features/notifications';

interface NavbarProps {
  onMenuToggle?: () => void;
  isSidebarCollapsed?: boolean;
}

const Navbar = ({ onMenuToggle }: NavbarProps) => {
  const { user } = useUserStore();
  const { i18n, t } = useTranslation();

  const { data: unreadNotificationsCount } = useGetUnreadNotificationsCountData(
    {},
  );

  return (
    <nav className="bg-[#FCFCFC] px-6 py-3 flex items-center justify-between sticky top-0 z-40 h-20 shadow-2xs">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200 md:hidden"
          aria-label="Toggle sidebar"
        >
          <BurgerIcon className="w-5 h-5 text-gray-600" />
        </button>

        <div className="hidden md:block">
          <span className="text-sm font-medium text-gray-500">
            {t('navbar.welcome', 'Welcome!')}
          </span>
          <h1 className="text-lg font-bold text-gray-900">
            {i18n.language === 'en' ? user?.full_name_en : user?.full_name_ar}
          </h1>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <BusinessDropdown />
        <NotificationDropdown
          unreadNotificationsCount={unreadNotificationsCount?.data.count || 0}
        />
        <UserDropdown />
      </div>
    </nav>
  );
};

export default Navbar;
