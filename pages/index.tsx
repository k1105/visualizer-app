import { Sketch } from "@/components/Sketch";
import { useEffect, useRef, useState } from "react";
import { parseResponse } from "@/lib/parseResponse";

type Bbox = {
  confidence: number;
  bbox: [number, number, number, number];
};

const Home = () => {
  const [bboxes, setBboxes] = useState<Bbox[]>([]);

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

  return (
    <>
      <div>
        <Sketch bboxes={bboxes} />
      </div>
      <style jsx>{``}</style>
    </>
  );
};

export default Home;
