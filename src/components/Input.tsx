type name = {
  text: string;
  type: string;
  value: string;
  change: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Input = ({ text, type, value, change }: name) => {
  return (
    <input
      className="border  h-10 rounded text-white"
      type={type}
      placeholder={text}
      value={value}
      onChange={change}
    />
  );
};
