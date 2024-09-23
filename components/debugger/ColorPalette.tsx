type Props = {
  setColor: (color: string) => void;
};

export const ColorPalette = ({ setColor }: Props) => {
  return (
    <>
      <div className="container">
        <div
          className="unit"
          style={{ backgroundColor: "#31805D" }}
          onClick={() => setColor("#31805D")}
        />
        <div
          className="unit"
          style={{ backgroundColor: "#3EA275" }}
          onClick={() => setColor("#3EA275")}
        />
        <div
          className="unit"
          style={{ backgroundColor: "#41AB7B" }}
          onClick={() => setColor("#41AB7B")}
        />
        <div
          className="unit"
          style={{ backgroundColor: "#245E44" }}
          onClick={() => setColor("#245E44")}
        />
        <div
          className="unit"
          style={{ backgroundColor: "#173C2C" }}
          onClick={() => setColor("#173C2C")}
        />
        <div
          className="unit"
          style={{ backgroundColor: "black" }}
          onClick={() => setColor("black")}
        />
      </div>
      <style jsx>{`
        .container {
          display: flex;
          width: 9rem;
          justify-content: space-between;
        }

        .unit {
          width: 1.2rem;
          height: 1.2rem;
          border-radius: 0.6rem;
          border: 1px solid #cccc;
          cursor: pointer;
        }
      `}</style>
    </>
  );
};
