const XYInputField = ({
  propertyName,
  value,
  setValue,
}: {
  propertyName: string;
  value: { x: number; y: number };
  setValue: (val: { x: number; y: number }) => void;
}) => {
  return (
    <>
      <div>
        <p className="headline">{propertyName}:</p>
        <div className="input-field-container">
          <p>x: </p>
          <input
            type="number"
            defaultValue={value.x}
            onChange={(e) => {
              setValue({ x: Number(e.target.value), y: value.y });
            }}
          />
          <p>y: </p>
          <input
            type="number"
            defaultValue={value.y}
            onChange={(e) => {
              setValue({ x: value.x, y: Number(e.target.value) });
            }}
          />
        </div>
      </div>
      <style jsx>{`
        .headline {
          font-size: 0.9rem;
          margin-bottom: 0.2rem;
        }

        .input-field-container {
          display: flex;
          gap: 0.7rem;
          input {
            width: 40px;
          }
        }
      `}</style>
    </>
  );
};

export default XYInputField;
