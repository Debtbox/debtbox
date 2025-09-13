const Success = ({
  title,
  description,
}: {
  title: string;
  description?: string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-4">
      <svg
        width="94"
        height="94"
        viewBox="0 0 94 94"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="47.0001"
          cy="46.631"
          r="46.631"
          fill="#23A26D"
          fillOpacity="0.12"
        />
        <path
          d="M46.1678 23.2975C33.3111 23.2975 22.8345 33.7742 22.8345 46.6308C22.8345 59.4875 33.3111 69.9642 46.1678 69.9642C59.0245 69.9642 69.5011 59.4875 69.5011 46.6308C69.5011 33.7742 59.0245 23.2975 46.1678 23.2975ZM57.3211 41.2642L44.0911 54.4942C43.7645 54.8208 43.3211 55.0075 42.8545 55.0075C42.3878 55.0075 41.9445 54.8208 41.6178 54.4942L35.0145 47.8908C34.3378 47.2142 34.3378 46.0942 35.0145 45.4175C35.6911 44.7408 36.8111 44.7408 37.4878 45.4175L42.8545 50.7842L54.8478 38.7908C55.5245 38.1142 56.6445 38.1142 57.3211 38.7908C57.9978 39.4675 57.9978 40.5642 57.3211 41.2642Z"
          fill="#23A26D"
        />
      </svg>

      <h1 className="text-[28px] font-bold">{title}</h1>
      {description && <p className="text-sm text-[#828282]">{description}</p>}
    </div>
  );
};

export default Success;
