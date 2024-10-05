import { Sketch } from "@/components/Sketch";
import { useEffect, useState, useRef } from "react";
import { parseResponse } from "@/lib/parseResponse";
import { parsePoseResponse } from "@/lib/parsePoseResponse";
import { Person } from "@/types/PersonClass";

const Home = () => {
  // const [bboxes, setBboxes] = useState<Bbox[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [pose, setPose] = useState<PoseData[]>([]);
  const [server, setServer] = useState<string>("localhost");

  const peopleWsRef = useRef<WebSocket | null>(null);
  const poseWsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // people用WebSocket（port:8765）
    const peopleWs = new WebSocket(`ws://${server}:8765`);
    peopleWsRef.current = peopleWs;

    peopleWs.onmessage = (event) => {
      const data = parseResponse(event.data); // peopleデータのパース
      setPeople(data);
    };

    peopleWs.onclose = () => {
      console.log("WebSocket connection to port 8765 closed");
    };

    // pose用WebSocket（port:8080）
    const poseWs = new WebSocket(`ws://${server}:8080`);
    poseWsRef.current = poseWs;

    poseWs.onmessage = (event) => {
      const data = parsePoseResponse(event.data); // poseデータのパース
      setPose(data);
    };

    poseWs.onclose = () => {
      console.log("WebSocket connection to port 8080 closed");
    };

    return () => {
      peopleWs.close();
      poseWs.close();
    };
  }, [server]);

  useEffect(() => {
    console.log(pose);
  }, [pose]);

  return (
    <>
      <div>
        <Sketch
          people={people}
          pose={pose}
          server={server}
          setServer={setServer}
        />
      </div>
      <style jsx>{``}</style>
    </>
  );
};

export default Home;
