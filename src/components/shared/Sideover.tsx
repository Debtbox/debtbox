import clsx from 'clsx';
import React, { useEffect } from 'react';
import XIcon from '../icons/XIcon';

interface SideoverProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  width?: string;
  direction?: 'ltr' | 'rtl';
  className?: string;
  hasPadding?: boolean;
}

const Sideover = ({
  isOpen,
  onClose,
  children,
  title,
  width = 'w-full md:w-[60vw] xl:w-[40vw]',
  direction = 'ltr',
  className,
  hasPadding = true,
}: SideoverProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={clsx(
        'fixed inset-0 z-50 transition-opacity duration-300',
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
      )}
    >
      <div
        className={clsx(
          'fixed inset-0 bg-black/50 transition-opacity duration-300',
          isOpen ? 'bg-opacity-50' : 'bg-opacity-0',
        )}
        onClick={onClose}
      />

      <div
        className={clsx(
          'fixed end-0 top-0 h-full bg-white shadow-xl transform transition-all duration-300 ease-out rounded-s-3xl p-4 md:p-6',
          width,
          isOpen
            ? 'translate-x-0'
            : direction === 'rtl'
              ? '-translate-x-full'
              : 'translate-x-full',
          className,
        )}
      >
        <div className="flex items-center justify-between py-2 px-1 border-b border-gray-200">
          {title && (
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          )}
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Close sideover"
          >
            <XIcon />
          </button>
        </div>

        <div
          className={clsx('flex-1 overflow-y-auto', hasPadding ? 'p-6' : '')}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Sideover;
