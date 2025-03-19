import React, {createContext, useContext, useState} from "react";

interface CameraContextProps {
  cameraVisibility: boolean;
  setCameraVisibility: (cameraVisibility: boolean) => void;
  mirrored: boolean;
  setMirrored: (mirrored: boolean) => void;
  cameraResolution: {width: number; height: number} | null;
  setCameraResolution: (
    cameraResolution: {
      width: number;
      height: number;
    } | null
  ) => void;
}

const CameraPropertyContext = createContext<CameraContextProps | undefined>(
  undefined
);

export const CameraPropertyProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [cameraVisibility, setCameraVisibility] = useState<boolean>(true);

  const [cameraResolution, setCameraResolution] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [mirrored, setMirrored] = useState<boolean>(false);

  return (
    <CameraPropertyContext.Provider
      value={{
        cameraVisibility,
        setCameraVisibility,
        cameraResolution,
        setCameraResolution,
        mirrored,
        setMirrored,
      }}
    >
      {children}
    </CameraPropertyContext.Provider>
  );
};

export const useCameraProperty = () => {
  const context = useContext(CameraPropertyContext);
  if (!context) {
    throw new Error("useProperty must be used within a CameraPropertyProvider");
  }
  return context;
};
