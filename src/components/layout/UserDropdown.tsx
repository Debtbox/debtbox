import { useState, useRef, useEffect } from 'react';
import { clearCookie } from '@/utils/storage';
import { queryClient } from '@/lib/queryClient';
import { useTranslation } from 'react-i18next';
import { UserIcon } from 'lucide-react';

const UserDropdown = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    clearCookie('access_token');
    clearCookie('language');
    localStorage.clear();
    queryClient.clear();
    window.location.replace('/auth/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
      >
        <UserIcon className="w-5 h-5 text-gray-600" />
      </button>

      {isOpen && (
        <div className="absolute end-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
          <button
            onClick={handleLogout}
            className="block w-full text-start px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
          >
            {t('dashboard.logout', 'Logout')}
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
