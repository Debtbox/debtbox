const CheckBox = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) => {
  return (
    <div className="inline-flex items-center cursor-pointer relative">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={
          'peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-md bg-white checked:bg-primary checked:border-primary focus:ring-2 focus:ring-primary focus:outline-none transition-all duration-200'
        }
      />
      <svg
        className="absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none hidden peer-checked:block"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 8.5L7 11.5L12 6.5"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default CheckBox;
