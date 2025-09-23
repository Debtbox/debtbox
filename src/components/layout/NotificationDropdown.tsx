import { BellIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

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
    </div>
  );
};

export default NotificationDropdown;
