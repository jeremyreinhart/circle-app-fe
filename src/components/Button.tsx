type buttonProps = {
  text: string;
  typebut?: "submit" | "reset" | "button";
  clasName?: string;
  disabled?: boolean;
};

export const Button = ({ text, typebut, clasName, disabled }: buttonProps) => {
  return (
    <button type={typebut} disabled={disabled} className={clasName}>
      {text}
    </button>
  );
};
