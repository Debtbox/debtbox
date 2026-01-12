import { type ReactNode } from 'react';
import BigXIcon from '../icons/BigXIcon';

interface ConfirmationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  confirmButtonClassName?: string;
  icon?: ReactNode;
  isLoading?: boolean;
}

const ConfirmationPopup = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText,
  confirmButtonClassName = 'bg-red-600 hover:bg-red-700 text-white',
  isLoading = false,
}: ConfirmationPopupProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      <div
        className="absolute inset-0 bg-black/50 transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-scale-in">
        <div className="w-full flex justify-center pt-10">
          <BigXIcon />
        </div>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 text-center">
            {title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed text-center">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-3 p-6">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ${confirmButtonClassName}`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {confirmText}
              </div>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
