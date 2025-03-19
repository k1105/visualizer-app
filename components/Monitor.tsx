import {useRef} from "react";
import Webcam from "react-webcam";
import {useProperty} from "./context/PropertyContext";

type MonitorProps = {
  setCameraResolution: (
    resolution: {width: number; height: number} | null
  ) => void;
  scale: number;
  offset: {x: number; y: number};
  mirrored: boolean;
  canvasSize: {width: number; height: number};
};

export const Monitor = ({
  setCameraResolution,
  scale,
  mirrored,
  offset,
  canvasSize,
}: MonitorProps) => {
  const webcamContainerRef = useRef<HTMLDivElement>(null);

  const {translate} = useProperty();

  const handleUserMedia = (stream: MediaStream) => {
    const videoTrack = stream.getVideoTracks()[0];
    const settings = videoTrack.getSettings();
    const {width, height} = settings;
    setCameraResolution({width: width || 0, height: height || 0});
  };

  const videoConstraints = {
    width: 1280,
    height: 720,
    aspectRatio: 16 / 9,
  };

  return (
    <>
      <div className="canvas-wrapper" ref={webcamContainerRef}>
        <div className="webcam-wrapper">
          <Webcam
            mirrored={mirrored ? true : false}
            width={canvasSize.width * scale}
            height={canvasSize.height * scale}
            onUserMedia={handleUserMedia}
            videoConstraints={videoConstraints}
          />
        </div>
      </div>
      <style jsx>{`
        .canvas-wrapper {
          position: absolute;
          width: ${canvasSize.width}px;
          height: ${canvasSize.height}px;
          left: 50%;
          top: 50%;
          transform: translate(-${translate.x}%, -${translate.y}%);
          z-index: -1;
          overflow: hidden;
        }

        .webcam-wrapper {
          margin-top: ${offset.y}px;
          margin-left: ${offset.x}px;
        }
      `}</style>
    </>
  );
};
