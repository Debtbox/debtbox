import { useState, useEffect } from 'react';

export const useSecurityDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+Shift+S to open security dashboard
      if (event.ctrlKey && event.shiftKey && event.key === 'S') {
        event.preventDefault();
        setIsOpen(true);
      }
      
      // Escape to close security dashboard
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return {
    isOpen,
    openDashboard: () => setIsOpen(true),
    closeDashboard: () => setIsOpen(false),
    toggleDashboard: () => setIsOpen(!isOpen),
  };
};
