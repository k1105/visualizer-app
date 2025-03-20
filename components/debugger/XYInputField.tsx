import classes from "@/styles/components/Debugger.module.css";

const XYInputField = ({
  propertyName,
  value,
  setValue,
  min,
  max,
}: {
  propertyName: string;
  value: {x: number; y: number};
  setValue: (val: {x: number; y: number}) => void;
  min?: number;
  max?: number;
}) => {
  return (
    <>
      <div>
        <p className={classes.headline}>{propertyName}:</p>
        <div className={classes.inputFieldContainer}>
          <p>x: </p>
          <input
            type="number"
            defaultValue={value.x}
            min={min}
            max={max}
            onChange={(e) => {
              setValue({x: Number(e.target.value), y: value.y});
            }}
          />
          <p>y: </p>
          <input
            type="number"
            defaultValue={value.y}
            min={min}
            max={max}
            onChange={(e) => {
              setValue({x: value.x, y: Number(e.target.value)});
            }}
          />
        </div>
      </div>
    </>
  );
};

export default XYInputField;
