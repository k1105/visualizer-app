import { Sketch } from "@/components/Sketch";
import { useEffect, useState, useRef } from "react";
import { parseResponse } from "@/lib/parseResponse";
import { Person } from "@/types/PersonClass";

const Home = () => {
  // const [bboxes, setBboxes] = useState<Bbox[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [server, setServer] = useState<string>("localhost");

  const peopleWsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const peopleWs = new WebSocket(`ws://${server}:8765`);

    peopleWs.onopen = () => {
      console.log("peopleWs: connected!");
    };
    peopleWs.onmessage = (event) => {
      console.log("peopleWs: onmessage", event.data);
      const data = parseResponse(event.data);
      setPeople(data);
    };
    peopleWs.onerror = (err) => {
      console.error("peopleWs: error", err);
    };
    peopleWs.onclose = () => {
      console.log("peopleWs: onclose");
    };

    const poseWs = new WebSocket(`ws://${server}:8080`);
    poseWs.onopen = () => {
      console.log("poseWs: connected!");
    };
    poseWs.onerror = (err) => {
      console.error("poseWs: error", err);
    };
    poseWs.onclose = () => {
      console.log("poseWs: onclose");
    };

    return () => {
      peopleWs.close();
      poseWs.close();
    };
  }, [server]);

  return (
    <>
      <div>
        <Sketch people={people} server={server} setServer={setServer} />
      </div>
      <style jsx>{``}</style>
    </>
  );
};

export default Home;
