import { VisibilityOn } from "../icon/VisibilityOn";
import { VisibilityOff } from "../icon/VisibilityOff";
import { SetStateAction } from "react";

const ToggleVisibilityButton = ({
  propertyName,
  visibility,
  setVisibility,
}: {
  propertyName: string;
  setVisibility: (value: boolean) => void;
  visibility: boolean;
}) => {
  return (
    <>
      <div
        className="toggle-list"
        onClick={() => {
          setVisibility(!visibility);
        }}
      >
        <p>{propertyName}:</p>
        {visibility ? (
          <VisibilityOn
            style={{ width: "1.5rem", height: "1.5rem", color: "gray" }}
          />
        ) : (
          <VisibilityOff
            style={{ width: "1.5rem", height: "1.5rem", color: "gray" }}
          />
        )}
      </div>
      <style jsx>{`
        .toggle-list {
          font-size: 1rem;
          display: flex;
          width: 9rem;
          justify-content: space-between;
        }
      `}</style>
    </>
  );
};

export default ToggleVisibilityButton;
