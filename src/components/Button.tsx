type buttonProps = {
  text: string;
  typebut: "submit" | "reset" | "button";
  clasName: string;
};

export const Button = ({ text, typebut, clasName }: buttonProps) => {
  return (
    <button type={typebut} className={clasName}>
      {text}
    </button>
  );
};
