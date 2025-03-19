import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import {Person} from "@/types/PersonClass";
import {parseResponse} from "@/lib/parseResponse";
import {DisplayedPerson} from "@/types/DisplayedPersonClass";

interface PropertyContextProps {
  scale: number;
  setScale: (scale: number) => void;
  offset: {x: number; y: number};
  setOffset: (offset: {x: number; y: number}) => void;
  translate: {x: number; y: number};
  setTranslate: (translate: {x: number; y: number}) => void;
  canvasSize: {width: number; height: number};
  setCanvasSize: (canvasSize: {width: number; height: number}) => void;
  textColor: string;
  setTextColor: (textColor: string) => void;
  areaRange: {min: number; max: number};
  setAreaRange: (areaRange: {min: number; max: number}) => void;
  debuggerVisibility: boolean;
  setDebuggerVisibility: (debuggerVisibility: boolean) => void;
  server: string;
  setServer: (server: string) => void;
  people: Person[];
  setPeople: (peole: Person[]) => void;
  displayedPeopleRef: React.MutableRefObject<DisplayedPerson[]>;
}

const PropertyContext = createContext<PropertyContextProps | undefined>(
  undefined
);

export const PropertyProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [scale, setScale] = useState<number>(1);
  const [offset, setOffset] = useState<{x: number; y: number}>({
    x: 0,
    y: 0,
  });
  const [translate, setTranslate] = useState<{x: number; y: number}>({
    x: 50,
    y: 50,
  });
  const [canvasSize, setCanvasSize] = useState<{
    width: number;
    height: number;
  }>({width: 0, height: 0});
  const [textColor, setTextColor] = useState<string>("white");
  const [areaRange, setAreaRange] = useState<{min: number; max: number}>({
    min: 0,
    max: 100,
  });
  const [debuggerVisibility, setDebuggerVisibility] = useState<boolean>(true);

  const [server, setServer] = useState<string>("localhost");

  const [people, setPeople] = useState<Person[]>([]);

  const displayedPeopleRef = useRef<DisplayedPerson[]>([]);

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

  useEffect(() => {
    setCanvasSize({width: window.innerWidth, height: window.innerHeight});
  }, []);

  return (
    <PropertyContext.Provider
      value={{
        scale,
        setScale,
        offset,
        setOffset,
        translate,
        setTranslate,
        canvasSize,
        setCanvasSize,
        textColor,
        setTextColor,
        areaRange,
        setAreaRange,
        debuggerVisibility,
        setDebuggerVisibility,
        server,
        setServer,
        people,
        setPeople,
        displayedPeopleRef,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error("useProperty must be used within a PropertyProvider");
  }
  return context;
};
