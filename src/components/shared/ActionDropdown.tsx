import { useState, useRef, useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ActionItem {
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: ReactNode;
  className?: string;
}

interface ActionDropdownProps {
  trigger: ReactNode;
  actions: ActionItem[];
  className?: string;
}

const ActionDropdown = ({
  trigger,
  actions,
  className = '',
}: ActionDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, right: 'auto' });
  const [isPositioned, setIsPositioned] = useState(false);
  const [isActionClicked, setIsActionClicked] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Don't close if an action was just clicked
      if (isActionClicked) {
        setIsActionClicked(false);
        return;
      }
      
      const target = event.target as Node;
      
      // Check if click is inside dropdown or trigger
      const isInsideDropdown = dropdownRef.current?.contains(target);
      const isInsideTrigger = triggerRef.current?.contains(target);
      
      // Only close if click is completely outside both dropdown and trigger
      if (!isInsideDropdown && !isInsideTrigger) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, isActionClicked]);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const dropdownWidth = 192;
      const dropdownHeight = actions.length * 40 + 16;

      let top = triggerRect.bottom + 8;
      let left = triggerRect.right - dropdownWidth;

      if (left < 0) {
        left = 8;
      }

      const spaceBelow = viewportHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;

      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        top = triggerRect.top - dropdownHeight - 8;
      }

      setPosition({ top, left, right: 'auto' });
      setIsPositioned(true);
    } else {
      setIsPositioned(false);
    }
  }, [isOpen, actions.length]);

  return (
    <>
      <div className={`relative ${className}`}>
        <div ref={triggerRef} onClick={() => setIsOpen(!isOpen)}>
          {trigger}
        </div>
      </div>

       {isOpen &&
         isPositioned &&
         createPortal(
           <div
             ref={dropdownRef}
             data-action-dropdown
             className="fixed w-48 bg-white shadow-lg py-1 z-[9999] transition-all duration-200 ease-in-out transform opacity-100"
             style={{
               top: position.top,
               left: position.left,
               right: position.right,
             }}
           >
             {actions.map((action, index) => (
               <button
                 key={index}
                 onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                   e.preventDefault();
                   e.stopPropagation();
                   setIsActionClicked(true);
                   action.onClick(e);
                   setIsOpen(false);
                 }}
                 className={`w-full text-start px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer flex items-center gap-2 ${action.className || ''}`}
               >
                 {action.icon}
                 {action.label}
               </button>
             ))}
          </div>,
          document.body,
        )}
    </>
  );
};

export default ActionDropdown;
