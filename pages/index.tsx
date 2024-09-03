import { Sketch } from "@/components/Sketch";
import { useEffect, useState } from "react";
import { parseResponse } from "@/lib/parseResponse";

type Bbox = {
  confidence: number;
  bbox: [number, number, number, number];
};

const Home = () => {
  const [bboxes, setBboxes] = useState<Bbox[]>([]);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8765");

    ws.onmessage = (event) => {
      setBboxes(parseResponse(event.data));
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, []);

  const enableAudio = () => {
    setIsAudioEnabled(true);
  };

  return (
    <>
      {!isAudioEnabled && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          }}
        >
          <button
            onClick={enableAudio}
            style={{ padding: "10px 20px", fontSize: "18px" }}
          >
            Click to enable audio
          </button>
        </div>
      )}
      <div>
        <Sketch bboxes={bboxes} isAudioEnabled={isAudioEnabled} />
      </div>
      <style jsx>{``}</style>
    </>
  );
};

export default Home;
