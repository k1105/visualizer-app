import classes from "@/styles/components/Debugger.module.css";

const MinMaxInputField = ({
  propertyName,
  value,
  setValue,
}: {
  propertyName: string;
  value: { min: number; max: number };
  setValue: (val: { min: number; max: number }) => void;
}) => {
  return (
    <>
      <div>
        <p className={classes.headline}>{propertyName}:</p>
        <div className={classes.inputFieldContainer}>
          <input
            type="number"
            defaultValue={value.min}
            onChange={(e) => {
              setValue({ min: Number(e.target.value), max: value.max });
            }}
          />
          <p> - </p>
          <input
            type="number"
            defaultValue={value.max}
            onChange={(e) => {
              setValue({ min: value.min, max: Number(e.target.value) });
            }}
          />
        </div>
      </div>
    </>
  );
};

export default MinMaxInputField;
