import styles from "@/styles/components/Debugger.module.scss";

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
        <p className={styles.headline}>{propertyName}:</p>
        <div className={styles.inputFieldContainer}>
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
