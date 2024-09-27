import classes from "@/styles/components/Debugger.module.css";

const WidthHeightInputField = ({
  propertyName,
  value,
  setValue,
}: {
  propertyName: string;
  value: { width: number; height: number };
  setValue: (val: { width: number; height: number }) => void;
}) => {
  return (
    <>
      <div>
        <p className={classes.headline}>{propertyName}:</p>
        <div className={classes.inputFieldContainer}>
          <p>w: </p>
          <input
            type="number"
            defaultValue={value.width}
            onChange={(e) => {
              setValue({ width: Number(e.target.value), height: value.height });
            }}
          />
          <p>h: </p>
          <input
            type="number"
            defaultValue={value.height}
            onChange={(e) => {
              setValue({ width: value.width, height: Number(e.target.value) });
            }}
          />
        </div>
      </div>
    </>
  );
};

export default WidthHeightInputField;
