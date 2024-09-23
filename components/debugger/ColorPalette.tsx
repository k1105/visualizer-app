type Props = {
  setColor: (color: string) => void;
};

export const ColorPalette = ({ setColor }: Props) => {
  return (
    <>
      <div className="container">
        <div
          className="unit"
          style={{ backgroundColor: "red" }}
          onClick={() => setColor("red")}
        />
        <div
          className="unit"
          style={{ backgroundColor: "yellow" }}
          onClick={() => setColor("#ffff00")}
        />
        <div
          className="unit"
          style={{ backgroundColor: "green" }}
          onClick={() => setColor("green")}
        />
        <div
          className="unit"
          style={{ backgroundColor: "blue" }}
          onClick={() => setColor("blue")}
        />
        <div
          className="unit"
          style={{ backgroundColor: "white" }}
          onClick={() => setColor("white")}
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
