import { useState, useRef, useEffect } from 'react';
import { clearCookie } from '@/utils/storage';
import { queryClient } from '@/lib/queryClient';
import { useTranslation } from 'react-i18next';
import { UserIcon } from 'lucide-react';
import { changeLanguage } from '@/utils/changeLanguage';
import { arFlag, enFlag } from '@/assets/images';

const UserDropdown = () => {
  const { t, i18n } = useTranslation();
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

      <div
        className={`absolute end-0 mt-4 w-48 bg-white shadow-lg py-1 z-50 transition-all duration-300 ease-in-out transform ${
          isOpen
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
        }`}
        
      >
        <button
          onClick={() => {
            changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
            setIsOpen(false);
          }}
          className="w-full text-start px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
        >
          <img
            src={i18n.language === 'ar' ? enFlag : arFlag}
            alt="language"
            className="w-5 h-5"
          />
          {i18n.language === 'ar' ? 'English' : 'العربية'}
        </button>
        <button
          onClick={handleLogout}
          className="w-full text-start px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer"
        >
          {t('common.buttons.logout', 'Logout')}
        </button>
      </div>
    </div>
  );
};

export default UserDropdown;
