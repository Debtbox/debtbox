import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '@/stores/UserStore';
import { Building2 } from 'lucide-react';
import type { BusinessDto } from '@/types/UserDto';

const BusinessDropdown = () => {
  const { t, i18n } = useTranslation();
  const { user, selectedBusiness, setSelectedBusiness } = useUserStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const businesses = user?.businesses || [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleBusinessSelect = (business: BusinessDto) => {
    setSelectedBusiness(business);
    setIsDropdownOpen(false);
  };

  const getDisplayName = (business: BusinessDto) => {
    return i18n.language === 'ar'
      ? business.business_name_ar
      : business.business_name_en;
  };

  const currentBusiness = selectedBusiness || businesses[0];

  if (!businesses.length) {
    return (
      <div className="py-2 px-4 flex items-center gap-2 bg-gray-100 text-sm text-gray-500">
        <Building2 className="w-4 h-4 text-gray-400" />
        <span>{t('business.noBusinesses', 'No businesses available')}</span>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="py-3 px-4 flex items-center gap-2 bg-white rounded-lg border border-gray-200 cursor-pointer hover:shadow-xl transition-shadow min-w-[200px]"
      >
        <Building2 className="w-4 h-4 text-gray-600" />
        <span className="text-sm text-gray-700 truncate">
          {currentBusiness
            ? getDisplayName(currentBusiness)
            : t('business.select', 'Select Business')}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isDropdownOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
          <div className="p-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">
              {t('business.selectBusiness', 'Select Business')}
            </h3>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {businesses.map((business) => (
              <button
                key={business.cr_number}
                onClick={() => handleBusinessSelect(business)}
                className={`w-full px-4 py-3 flex flex-col items-start text-left hover:bg-gray-50 transition-colors ${
                  selectedBusiness?.cr_number === business.cr_number
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-medium truncate">
                    {getDisplayName(business)}
                  </span>
                  {selectedBusiness?.cr_number === business.cr_number && (
                    <svg
                      className="w-4 h-4 text-blue-600 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  <div>
                    {t('business.crNumber', 'CR')}: {business.cr_number}
                  </div>
                  <div>{business.activity}</div>
                  <div>{business.city}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessDropdown;
