import { BellIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import DBIcon from '../icons/DBIcon';
import DotsIcon from '../icons/DotsIcon';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
        <BellIcon className="w-5 h-5 text-gray-600" />
      </button>
      {isOpen && (
        <div className="fixed md:absolute end-0 mt-4 w-screen md:w-100 bg-white shadow-lg z-50 flex flex-col max-h-[calc(100vh-.25rem*20)] md:max-h-[500px] overflow-y-auto">
          {Array.from({ length: 40 }).map((_, index) => (
            <div
              key={index}
              className="flex items-start gap-2 px-8 md:px-4 py-3 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
            >
              <div>
                <div className="w-12 h-12 rounded-full bg-[#F6F6F6] flex items-center justify-center">
                  <DBIcon />
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <h6 className="text-sm font-medium text-gray-600">
                  New Feature Alert!
                </h6>
                <p className="text-xs text-gray-500">
                  We’re pleased to introduce the latest enhancements in our
                  templating experience.
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500">15H</span>
                <button className="cursor-pointer">
                  <DotsIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
