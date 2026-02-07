import clsx from 'clsx';
import { SaudiRiyal } from 'lucide-react';

const colorClasses = {
  gray: { ring: 'bg-[#4F5154]/30', dot: 'bg-[#4F5154]' },
  red: { ring: 'bg-[#FF4757]/30', dot: 'bg-[#FF4757]' },
  green: { ring: 'bg-[#0A9458]/30', dot: 'bg-[#0A9458]' },
} as const;

const TotalCard = ({
  value,
  title,
  color = 'gray',
}: {
  value: number;
  title: string;
  color?: keyof typeof colorClasses;
}) => {
  const styles = colorClasses[color];

  return (
    <div className="bg-white p-5 rounded-2xl flex justify-between items-center hover:shadow-md transition-shadow duration-200">
      <span className="text-black text-xs capitalize flex items-center gap-2">
        <span
          className={clsx(
            'w-4 h-4 rounded-full flex items-center justify-center',
            styles.ring,
          )}
        >
          <span className={clsx('w-2 h-2 rounded-full', styles.dot)} />
        </span>
        {title}
      </span>
      <span className="text-black font-semibold text-2xl flex items-center gap-1">
        <SaudiRiyal className="text-gray-900" /> {value.toLocaleString()}
      </span>
    </div>
  );
};

export default TotalCard;
