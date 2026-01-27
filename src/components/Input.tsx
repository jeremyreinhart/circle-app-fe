type name = {
  text?: string;
  type?: string;
  value?: string;
  change?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

export const Input = ({
  text,
  type,
  value,
  change,
  className = "border  h-10 rounded text-white",
}: name) => {
  return (
    <input
      className={className}
      type={type}
      placeholder={text}
      value={value}
      onChange={change}
    />
  );
};
