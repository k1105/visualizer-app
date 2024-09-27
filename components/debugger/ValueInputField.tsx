import classes from "@/styles/components/Debugger.module.css";

const ValueInputField = ({
  propertyName,
  value,
  setValue,
}: {
  propertyName: string;
  value: number;
  setValue: (value: number) => void;
}) => {
  return (
    <>
      <div>
        <p className={classes.headline}>{propertyName}:</p>
        <input
          type="number"
          defaultValue={value}
          onChange={(e) => {
            setValue(Number(e.target.value));
          }}
        />
      </div>
    </>
  );
};

export default ValueInputField;
