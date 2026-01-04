import { arFlag, enFlag, urFlag, bnFlag } from '@/assets/images';
import { changeLanguage } from '@/utils/changeLanguage';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageDropdown = () => {
  const { i18n } = useTranslation();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', name: 'EN', flag: enFlag },
    { code: 'ar', name: 'العربية', flag: arFlag },
    { code: 'ur', name: 'اوردو', flag: urFlag },
    { code: 'bn', name: 'بنغالي', flag: bnFlag },
  ];

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

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

  const handleLanguageChange = (languageCode: string) => {
    changeLanguage(languageCode);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="h-10 px-3 flex items-center gap-2 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
      >
        <img
          src={currentLanguage.flag}
          alt={`${currentLanguage.code}-flag`}
          className="w-5 h-5"
        />
        <span className="text-sm text-gray-700 font-medium">
          {currentLanguage.name}
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
        <div className="absolute top-full end-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                language.code === currentLanguage.code
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700'
              }`}
            >
              <img
                src={language.flag}
                alt={`${language.code}-flag`}
                className="w-5 h-5"
              />
              <span className="text-sm font-medium">{language.name}</span>
              {language.code === currentLanguage.code && (
                <svg
                  className="w-4 h-4 ml-auto text-blue-600"
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
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;
