import { X } from 'lucide-react';

interface StatusBadgesProps {
  selectedStatuses: string[];
  onRemove: (status: string) => void;
  statusOptions: Array<{ value: string; label: string }>;
}

const StatusBadges = ({ selectedStatuses, onRemove, statusOptions }: StatusBadgesProps) => {
  if (selectedStatuses.length === 0) return null;

  const selectedOptions = statusOptions.filter(option => selectedStatuses.includes(option.value));

  return (
    <div className="flex flex-wrap gap-2">
      {selectedOptions.map((option) => (
        <div
          key={option.value}
          className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
        >
          <span>{option.label}</span>
          <button
            type="button"
            onClick={() => onRemove(option.value)}
            className="ml-1 hover:bg-primary/20 rounded-full p-0.5 transition-colors"
            aria-label={`Remove ${option.label}`}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default StatusBadges;
