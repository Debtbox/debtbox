import { noData } from '@/assets/images';

const NoData = ({
  title,
  description,
}: {
  title: string;
  description?: string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <img src={noData} alt="No Data" width={250} height={250} loading="lazy" decoding="async" />
      <h1 className="text-2xl font-bold text-black">{title}</h1>
      {description && <p className="text-sm text-black">{description}</p>}
    </div>
  );
};

export default NoData;
