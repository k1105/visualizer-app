import { Sketch } from "@/components/Sketch";
import { useEffect, useState } from "react";
import { parseResponse } from "@/lib/parseResponse";
import { Person } from "@/types/PersonClass";

const Home = () => {
  // const [bboxes, setBboxes] = useState<Bbox[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [server, setServer] = useState<string>("localhost");

  useEffect(() => {
    // const ws = new WebSocket("ws://192.168.0.100:8765");
    const ws = new WebSocket(`ws://${server}:8765`);

    ws.onmessage = (event) => {
      // setBboxes(parseResponse(event.data) as Bbox[]);
      setPeople(parseResponse(event.data) as Person[]);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, [server]);

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
        <Sketch
          people={people}
          isAudioEnabled={isAudioEnabled}
          server={server}
          setServer={setServer}
        />
      </div>
      <style jsx>{``}</style>
    </>
  );
};

export default Home;
