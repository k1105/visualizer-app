import * as React from "react";
import { P5CanvasInstance } from "@p5-wrapper/react";
import { NextReactP5Wrapper } from "@p5-wrapper/next";
import { Person } from "@/types/PersonClass";
import { DisplayedPerson } from "@/types/DisplayedPersonClass";
import { Debugger } from "./Debugger";
import { useState, useRef, useCallback, useEffect } from "react";
import showCharacter from "./showCharacter";
import showBoundingBox from "./showBoundingBox";
import p5Types from "p5";

export function Sketch({
  people,
  server,
  setServer,
}: {
  people: Person[];
  server: string;
  setServer: (server: string) => void;
}) {
  const peopleRef = useRef<Person[]>([]);
  const displayedPeopleRef = useRef<DisplayedPerson[]>([]);
  const [textColor, setTextColor] = useState<string>("white");
  const [scale, setScale] = useState<number>(1);
  const [areaRange, setAreaRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 100,
  });
  const [offset, setOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [translate, setTranslate] = useState<{ x: number; y: number }>({
    x: 50,
    y: 50,
  });
  const [speedThreshold, setSpeedThreshold] = useState<{
    x: number;
    y: number;
  }>({
    x: 200,
    y: 200,
  });
  const [canvasSize, setCanvasSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  const [debuggerVisibility, setDebuggerVisibility] = useState<boolean>(true);

  useEffect(() => {
    setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  const sketch = useCallback((p5: P5CanvasInstance) => {
    let k = 0; //拡大比率

    const inputImageSize = { x: 1280, y: 720 };
    const inputAspectRatio = inputImageSize.y / inputImageSize.x;
    // let isAudioEnabled = false;
    let font: p5Types.Font;
    let walkingAnnotation = false;
    let area_min = 0;
    let area_max = 100;
    let p5Offset: { x: number; y: number } = { x: 0, y: 0 };
    let p5SpeedThreshold: { x: number; y: number } = { x: 200, y: 200 };
    let p5TextColor = "white";
    let p5Scale: number = 1;

    p5.preload = () => {
      font = p5.loadFont("/fonts/HinaMincho-Regular.ttf");
    };

    p5.setup = () => {
      p5.createCanvas(p5.windowWidth, p5.windowHeight);
      p5.textFont(font);
      p5.noStroke();
      const aspectRatio = p5.height / p5.width;

      if (aspectRatio >= inputAspectRatio) {
        k = p5.width / inputImageSize.x;
      } else {
        k = p5.height / inputImageSize.y;
      }
    };

    p5.updateWithProps = (props) => {
      walkingAnnotation = props.debuggerVisibility as boolean;
      peopleRef.current = props.people as Person[];
      area_min = (props.areaRange as { min: number; max: number }).min;
      area_max = (props.areaRange as { min: number; max: number }).max;
      p5TextColor = props.textColor as string;

      p5Offset = props.offset as { x: number; y: number };
      p5SpeedThreshold = props.speedThreshold as { x: number; y: number };

      p5Scale = props.scale as number;

      // displayPeopleからフレームアウトした人を削除
      displayedPeopleRef.current = displayedPeopleRef.current.filter(
        (displayedPerson) =>
          peopleRef.current.some((person) => person.id === displayedPerson.id)
      );

      if (props.canvasWidth && props.canvasHeight) {
        if (
          p5.width !== Number(props.canvasWidth) ||
          p5.height !== Number(props.canvasHeight)
        ) {
          p5.resizeCanvas(
            Number(props.canvasWidth),
            Number(props.canvasHeight)
          );
        }

        const aspectRatio = p5.height / p5.width;

        if (aspectRatio >= inputAspectRatio) {
          k = p5.width / inputImageSize.x;
        } else {
          k = p5.height / inputImageSize.y;
        }
      }
    };

    p5.draw = () => {
      // update displayPeople
      for (const person of peopleRef.current) {
        const displayedPerson = displayedPeopleRef.current.find(
          (p) => p.id === person.id
        );

        if (displayedPerson) {
          displayedPerson.update(person);
        } else {
          displayedPeopleRef.current.push(
            new DisplayedPerson(
              person.id,
              person.getSpeed(),
              person.bbox,
              p5.frameCount,
              person.displayCharacter
            )
          );
        }
      }

      for (const displayedPerson of displayedPeopleRef.current) {
        displayedPerson.smoothedBbox.scale(k * p5Scale);
      }

      p5.clear();
      p5.fill(p5TextColor);

      p5.translate(p5Offset.x, p5Offset.y);

      for (const person of displayedPeopleRef.current) {
        person.updateMovingStatus(p5SpeedThreshold.x, p5SpeedThreshold.y);

        showCharacter({ person, p5 });
        showBoundingBox({
          person,
          p5,
          walkingAnnotation: walkingAnnotation,
        });
      }
    };
  }, []);

  return (
    <>
      <div className="canvas-wrapper">
        <NextReactP5Wrapper
          sketch={sketch}
          people={people}
          canvasWidth={canvasSize.width}
          canvasHeight={canvasSize.height}
          debuggerVisibility={debuggerVisibility}
          areaRange={areaRange}
          offset={offset}
          speedThreshold={speedThreshold}
          textColor={textColor}
          scale={scale}
        />
        <Debugger
          debuggerVisibility={debuggerVisibility}
          setDebuggerVisibility={setDebuggerVisibility}
          translate={translate}
          setTranslate={setTranslate}
          displayedPeopleRef={displayedPeopleRef}
          setTextColor={setTextColor}
          offset={offset}
          canvasSize={canvasSize}
          scale={scale}
          areaRange={areaRange}
          setOffset={setOffset}
          server={server}
          setServer={setServer}
          speedThreshold={speedThreshold}
          setSpeedThreshold={setSpeedThreshold}
          setScale={setScale}
          setCanvasSize={setCanvasSize}
          setAreaRange={setAreaRange}
        />
      </div>
      <style jsx>{`
        .canvas-wrapper {
          cursor: ${!debuggerVisibility && "none"};
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(${-translate.x}%, ${-translate.y}%);
        }
      `}</style>
    </>
  );
}
