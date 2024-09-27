import { Sketch } from "@/components/Sketch";
import { useEffect, useState, useRef } from "react";
import { parseResponse } from "@/lib/parseResponse";
import { Person } from "@/types/PersonClass";

const Home = () => {
  // const [bboxes, setBboxes] = useState<Bbox[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [server, setServer] = useState<string>("localhost");

  const personWsRef = useRef<WebSocket | null>(null);
  const audioWsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // const ws = new WebSocket("ws://192.168.0.100:8765");
    const personWs = new WebSocket(`ws://${server}:8765`);
    const audioWs = new WebSocket(`ws://${server}:8080`);

    personWsRef.current = personWs;
    audioWsRef.current = audioWs;

    personWs.onmessage = (event) => {
      // setBboxes(parseResponse(event.data) as Bbox[]);
      setPeople(parseResponse(event.data) as Person[]);
    };

    personWs.onclose = () => {
      console.log("WebSocket connection to port 8765 closed");
    };

    audioWs.onclose = () => {
      console.log("WebSocket connection to port 8080 closed");
    };

    return () => {
      personWs.close();
      audioWs.close();
    };
  }, [server]);

  return (
    <>
      <div>
        <Sketch
          people={people}
          server={server}
          setServer={setServer}
          audioWsRef={audioWsRef}
        />
      </div>
      <style jsx>{``}</style>
    </>
  );
};

export default Home;
