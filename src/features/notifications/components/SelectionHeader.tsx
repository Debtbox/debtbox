import { useTranslation } from 'react-i18next';
import type { SelectionHeaderProps } from './types';

const SelectionHeader = ({
  selectedCount,
  onSelectAll,
  onClearSelection,
  onExitSelection,
}: SelectionHeaderProps) => {
  const { t } = useTranslation();

  return (
    <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onSelectAll}
            className="text-sm text-black hover:text-black/90 font-medium"
          >
            {t('notifications.selectAll', 'Select All')}
          </button>
          <button
            onClick={onClearSelection}
            className="text-sm text-gray-600 hover:text-gray-700 font-medium"
          >
            {t('notifications.clearSelection', 'Clear')}
          </button>
          <span className="text-sm text-gray-500">
            {selectedCount}{' '}
            {t('notifications.selected', 'selected')}
          </span>
        </div>
        <button
          onClick={onExitSelection}
          className="text-sm text-gray-600 hover:text-gray-700 font-medium"
        >
          {t('notifications.cancel', 'Cancel')}
        </button>
      </div>
    </div>
  );
};

export default SelectionHeader;
