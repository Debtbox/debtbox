import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

const TotalCard = ({
  value,
  type,
}: {
  value: number;
  type: 'total' | 'unpaid' | 'paid';
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white p-5 rounded-2xl flex justify-between items-center">
      <span className="text-black text-xs capitalize flex items-center gap-2">
        <span
          className={clsx(
            'w-4 h-4 rounded-full flex items-center justify-center',
            type === 'total'
              ? 'bg-[#4F5154]/30'
              : type === 'unpaid'
                ? 'bg-[#FF4757]/30'
                : 'bg-[#0A9458]/30',
          )}
        >
          <span
            className={clsx(
              'w-2 h-2 rounded-full',
              type === 'total'
                ? 'bg-[#4F5154]'
                : type === 'unpaid'
                  ? 'bg-[#FF4757]'
                  : 'bg-[#0A9458]',
            )}
          />
        </span>
        {type === 'total'
          ? t('dashboard.total', 'Total')
          : type === 'unpaid'
            ? t('dashboard.unpaid', 'Due (Unpaid)')
            : t('dashboard.paid', 'Due (Paid)')}
      </span>
      <span className="text-black font-semibold text-2xl">
        {value.toLocaleString()} {t('common.fields.sar', 'SAR')}
      </span>
    </div>
  );
};

export default TotalCard;
