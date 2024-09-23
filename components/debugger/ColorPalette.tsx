type Props = {
  setColor: (color: string) => void;
};

export const ColorPalette = ({ setColor }: Props) => {
  return (
    <>
      <div className="container">
        <div
          className="unit"
          style={{ backgroundColor: "#AB4F41" }}
          onClick={() => setColor("#AB4F41")}
        />
        <div
          className="unit"
          style={{ backgroundColor: "#AB9E41" }}
          onClick={() => setColor("#AB9E41")}
        />
        <div
          className="unit"
          style={{ backgroundColor: "#41AB7B" }}
          onClick={() => setColor("#41AB7B")}
        />
        <div
          className="unit"
          style={{ backgroundColor: "#5341AB" }}
          onClick={() => setColor("#5341AB")}
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
