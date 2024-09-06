import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

type MonitorProps = {
  setCameraResolution: (
    resolution: { width: number; height: number } | null
  ) => void;
  scale: number;
  xOffset: number;
  yOffset: number;
  mirrored: boolean;
};

export const Monitor = ({
  setCameraResolution,
  scale,
  mirrored,
  xOffset,
  yOffset,
}: MonitorProps) => {
  const [innerWidth, setInnerWidth] = useState<number>(0);
  const [innerHeight, setInnerHeight] = useState<number>(0);
  const webcamContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInnerWidth(window.innerWidth);
    setInnerHeight(window.innerHeight);
  }, []);

  useEffect(() => {
    webcamContainerRef.current!.style.left = `${xOffset}px`;
  }, [xOffset]);

  useEffect(() => {
    webcamContainerRef.current!.style.top = `${yOffset}px`;
  }, [yOffset]);

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
      <div
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          zIndex: "-1",
          opacity: "0.5",
        }}
        ref={webcamContainerRef}
      >
        <Webcam
          mirrored={mirrored ? true : false}
          width={innerWidth * scale}
          height={innerHeight * scale}
          onUserMedia={handleUserMedia}
          videoConstraints={videoConstraints}
        />
      </div>
    </>
  );
};
