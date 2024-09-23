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
        <p className="headline">{propertyName}:</p>
        <input
          type="number"
          defaultValue={value}
          onChange={(e) => {
            setValue(Number(e.target.value));
          }}
        />
      </div>
      <style jsx>{`
        .headline {
          font-size: 0.9rem;
          margin-bottom: 0.2rem;
        }
      `}</style>
    </>
  );
};

export default ValueInputField;
