import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { sidebarLogo, dashboard, clients } from '@/assets/images';
import clsx from 'clsx';
import LineIcon from '../icons/LineIcon';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle?: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: string;
  badge?: string;
}

const Sidebar = ({ isCollapsed = true }: SidebarProps) => {
  const { t } = useTranslation();
  const location = useLocation();

  const navigation: NavItem[] = [
    {
      name: t('navigation.dashboard', 'Dashboard'),
      href: '/',
      icon: dashboard,
    },
    {
      name: t('navigation.clients', 'Clients'),
      href: '/clients',
      icon: clients,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div
      className={clsx(
        isCollapsed ? 'w-16' : 'w-64',
        'bg-white border-r border-gray-200 flex flex-col transition-all duration-300 h-screen',
      )}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-center p-2">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <img src={sidebarLogo} alt="DebtBox" className="h-16 w-auto" />
          </div>
        )}
      </div>
      <LineIcon className="w-full flex justify-center mb-3" />

      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={clsx(
              'group flex items-center px-2 py-2 font-medium rounded-md transition-colors duration-200',
              isActive(item.href)
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            )}
            title={isCollapsed ? item.name : undefined}
          >
            <img
              src={item.icon}
              alt={item.name}
              className={clsx(
                isCollapsed ? 'w-5 h-5' : 'w-5 h-5 mr-3',
                'flex-shrink-0',
                isActive(item.href) ? 'brightness-0 invert' : '',
              )}
            />
            {!isCollapsed && (
              <>
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                  <span
                    className={`ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded-full ${
                      isActive(item.href)
                        ? 'bg-white text-primary'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
