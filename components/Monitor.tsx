import { useEffect, useState } from "react";
import Webcam from "react-webcam";

export const Monitor = () => {
  const [innerWidth, setInnerWidth] = useState<number>(0);
  const [innerHeight, setInnerHeight] = useState<number>(0);
  const [cameraResolution, setCameraResolution] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    setInnerWidth(window.innerWidth);
    setInnerHeight(window.innerHeight);
  }, []);

  const handleUserMedia = (stream: MediaStream) => {
    const videoTrack = stream.getVideoTracks()[0];
    const settings = videoTrack.getSettings();
    const { width, height } = settings;
    setCameraResolution({ width: width || 0, height: height || 0 });
  };

  const videoConstraints = {
    width: 1280,
    height: 720,
    aspectRatio: 16 / 9,
  };

  return (
    <>
      <Webcam
        width={innerWidth}
        height={innerHeight}
        onUserMedia={handleUserMedia}
        videoConstraints={videoConstraints}
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          zIndex: "-1",
          opacity: "0.5",
        }}
      />
      {cameraResolution && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            color: "white",
            zIndex: "10",
          }}
        >
          <p>
            Camera Resolution: {cameraResolution.width}x
            {cameraResolution.height}
          </p>
        </div>
      )}
    </>
  );
};
