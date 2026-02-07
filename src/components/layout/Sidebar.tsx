import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import {
  sidebarLogo,
  dashboardSidebar,
  // clientsSidebar,
  usersListSidebar,
  // settingsSidebar,
  businessesSidebar,
} from '@/assets/images';
import clsx from 'clsx';
import LineIcon from '../icons/LineIcon';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle?: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: string;
}

const Sidebar = ({ isCollapsed = true, onToggle }: SidebarProps) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const navigation: NavItem[] = [
    {
      name: t('navigation.dashboard', 'Dashboard'),
      href: '/',
      icon: dashboardSidebar,
    },
    // {
    //   name: t('navigation.clients', 'Clients'),
    //   href: '/clients',
    //   icon: clientsSidebar,
    // },
    {
      name: t('navigation.transactions', 'Transactions'),
      href: '/transactions',
      icon: usersListSidebar,
    },
    {
      name: t('navigation.businesses', 'Businesses'),
      href: '/businesses',
      icon: businessesSidebar,
    },
    // {
    //   name: t('navigation.settings', 'Settings'),
    //   href: '/settings',
    //   icon: settingsSidebar,
    // },
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
        'bg-white shadow-lg relative flex flex-col transition-all duration-300 h-screen group/sidebar',
      )}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-center px-2 py-4">
        {!isCollapsed && (
          <Link
            to="/"
            className="flex items-center space-x-3 animate-fade-in transition-opacity duration-200"
          >
            <img src={sidebarLogo} alt="DebtBox" className="h-11 w-auto" />
          </Link>
        )}
        {isCollapsed && (
          <div className="w-full flex justify-center">
            <img
              src={sidebarLogo}
              alt="DebtBox"
              className="h-8 w-auto animate-fade-in"
            />
          </div>
        )}
      </div>
      <LineIcon className="w-full flex justify-center mb-3 transition-opacity duration-200" />

      <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto sidebar-scroll">
        {navigation.map((item, index) => (
          <Link
            key={item.name}
            to={item.href}
            className={clsx(
              'group flex items-center px-3 py-3 font-medium rounded-md transition-all duration-200 relative',
              isActive(item.href)
                ? 'text-dark-gray bg-gray-50 shadow-sm'
                : 'text-medium-gray hover:text-dark-gray hover:bg-gray-50',
            )}
            title={isCollapsed ? item.name : undefined}
          >
            <img
              src={item.icon}
              alt={item.name}
              className={clsx(
                isCollapsed ? 'w-5 h-5 mx-auto' : 'w-5 h-5 me-3',
                'shrink-0 transition-all duration-200',
                isActive(item.href)
                  ? 'brightness-100 invert'
                  : 'group-hover:brightness-100 group-hover:invert',
              )}
            />
            {!isCollapsed && (
              <span
                className="flex-1 transition-opacity duration-200"
                style={{
                  animation: `fade-in 0.3s ease-out ${index * 50}ms both`,
                }}
              >
                {item.name}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Toggle Button at Bottom - Only show on large screens */}
      {onToggle && (
        <div className="px-2 py-4 border-t border-gray-200">
          <button
            onClick={onToggle}
            className={clsx(
              'hidden md:flex items-center justify-center w-full h-10 rounded-md transition-all duration-200 hover:bg-gray-100',
              isCollapsed && 'justify-center',
            )}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight
                className={clsx(
                  'w-4 h-4 text-gray-600 transition-transform duration-200',
                  i18n.language === 'ar' && 'rotate-180',
                )}
              />
            ) : (
              <div className="flex items-center gap-2 w-full justify-between px-2">
                <span className="text-sm text-gray-600">
                  {t('common.buttons.collapse', 'Collapse')}
                </span>
                <ChevronLeft
                  className={clsx(
                    'w-4 h-4 text-gray-600 transition-transform duration-200',
                    i18n.language === 'ar' && 'rotate-180',
                  )}
                />
              </div>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
