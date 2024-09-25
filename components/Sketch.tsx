import * as React from "react";
import { P5CanvasInstance } from "@p5-wrapper/react";
import { NextReactP5Wrapper } from "@p5-wrapper/next";
import { Person } from "@/types/PersonClass";
import { DisplayedPerson } from "@/types/DisplayedPersonClass";
import { Debugger } from "./Debugger";
import { useState, useRef, useCallback, useEffect } from "react";
import { findClosestCharacter } from "@/lib/findClosestCharacter";
import showCharacter from "./showCharacter";

export function Sketch({
  people,
  isAudioEnabled,
  server,
  setServer,
}: {
  people: Person[];
  isAudioEnabled: boolean;
  server: string;
  setServer: (server: string) => void;
}) {
  const thresholdRef = useRef<number>(200);
  const peopleRef = useRef<Person[]>([]);
  const displayedPeopleRef = useRef<DisplayedPerson[]>([]);
  const [textColor, setTextColor] = useState<string>("white");
  const [scale, setScale] = useState<number>(1);
  const [xOffset, setXOffset] = useState<number>(0);
  const [yOffset, setYOffset] = useState<number>(0);
  const [xTranslate, setXTranslate] = useState<number>(50);
  const [yTranslate, setYTranslate] = useState<number>(50);
  const [xSpeedThreshold, setXSpeedThreshold] = useState<number>(1000);
  const [ySpeedThreshold, setYSpeedThreshold] = useState<number>(1000);
  const [canvasSize, setCanvasSize] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });
  const [debuggerVisibility, setDebuggerVisibility] = useState<boolean>(true);

  useEffect(() => {
    setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  const sketch = useCallback(
    (p5: P5CanvasInstance) => {
      let k = 0; //拡大比率
      const charList = [
        { char: "L", xOffset: 10, yOffset: 43 },
        { char: "へ", xOffset: 5, yOffset: 52 },
        { char: "9", xOffset: 4, yOffset: 41 },
        { char: "フ", xOffset: 14, yOffset: 45 },
        { char: "8", xOffset: 4, yOffset: 42 },
        { char: "乙", xOffset: 9, yOffset: 40 },
      ];
      const audioList = [
        new Audio("/audio/lite/L-lite.m4a"),
        new Audio("/audio/lite/He-lite.m4a"),
        new Audio("/audio/lite/Kyu-lite.m4a"),
        new Audio("/audio/lite/Fu-lite.m4a"),
        new Audio("/audio/lite/Hachi-lite.m4a"),
        new Audio("/audio/lite/Otsu-lite.m4a"),
      ];

      const inputImageSize = { x: 1280, y: 720 };
      const inputAspectRatio = inputImageSize.y / inputImageSize.x;
      let isAudioEnabled = false;

      p5.setup = () => {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
        p5.fill(textColor);
        p5.noStroke();
        const aspectRatio = p5.height / p5.width;

        if (aspectRatio >= inputAspectRatio) {
          k = p5.width / inputImageSize.x;
        } else {
          k = p5.height / inputImageSize.y;
        }
      };

      p5.updateWithProps = (props) => {
        isAudioEnabled = props.isAudioEnabled as boolean;

        peopleRef.current = props.people as Person[];

        // displayPeopleからフレームアウトした人を削除
        displayedPeopleRef.current = displayedPeopleRef.current.filter(
          (displayedPerson) =>
            peopleRef.current.some((person) => person.id === displayedPerson.id)
        );

        if (props.canvasWidth && props.canvasHeight) {
          p5.resizeCanvas(
            Number(props.canvasWidth),
            Number(props.canvasHeight)
          );

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
                p5.frameCount
              )
            );
          }
        }

        for (const displayedPerson of displayedPeopleRef.current) {
          displayedPerson.smoothedBbox.scale(k * scale);
        }

        p5.clear();

        p5.translate(xOffset, yOffset);
        // p5.background(255, 0, 0);

        for (const person of displayedPeopleRef.current) {
          const box = person.smoothedBbox.bbox;
          const s = 0.01;

          person.updateMovingStatus(xSpeedThreshold, ySpeedThreshold);
          const aspectRatio =
            person.smoothedBbox.height() / person.smoothedBbox.width();

          if (person.movingStatus === "paused") {
            if (aspectRatio > 2) {
              person.displayCharacter = { char: "I", xOffset: 0, yOffset: 0 };
            } else if (aspectRatio > 1) {
              person.displayCharacter = { char: "Y", xOffset: 0, yOffset: 0 };
            } else {
              person.displayCharacter = { char: "T", xOffset: 0, yOffset: 0 };
            }
            // const res = findClosestCharacter(
            //   person.bbox.width() * s,
            //   person.bbox.height() * s
            // );
            // if (res.char !== "") person.displayCharacter = res;
          } else {
            //walking
            if (isAudioEnabled && p5.frameCount - person.lastUpdated > 5) {
              person.characterId++;
              person.lastUpdated = p5.frameCount;
              setTimeout(function () {
                audioList[person.characterId % charList.length].play();
              }, 200);
              person.pausedFrameCount = 0;
            }
            person.displayCharacter =
              charList[person.characterId % charList.length];
          }

          showCharacter({ person, p5 });

          // p5.push();
          // if (person.movingStatus == "walking") {
          //   p5.textSize(person.bbox.bbox[3] - person.bbox.bbox[1]);
          //   p5.textAlign(p5.CENTER);
          //   p5.text(
          //     person.displayCharacter.char,
          //     box[0],
          //     box[1],
          //     box[2] - box[0]
          //   );
          // } else {
          // }

          // p5.pop();
        }
      };
    },
    [textColor, xOffset, yOffset, scale, xSpeedThreshold, ySpeedThreshold]
  );

  return (
    <>
      <div className="canvas-wrapper">
        <NextReactP5Wrapper
          sketch={sketch}
          people={people}
          isAudioEnabled={isAudioEnabled}
          canvasWidth={canvasSize.width}
          canvasHeight={canvasSize.height}
        />
        <Debugger
          debuggerVisibility={debuggerVisibility}
          setDebuggerVisibility={setDebuggerVisibility}
          xTranslate={xTranslate}
          yTranslate={yTranslate}
          setXTranslate={setXTranslate}
          setYTranslate={setYTranslate}
          thresholdRef={thresholdRef}
          displayedPeopleRef={displayedPeopleRef}
          setTextColor={setTextColor}
          xOffset={xOffset}
          yOffset={yOffset}
          canvasSize={canvasSize}
          scale={scale}
          setXOffset={setXOffset}
          setYOffset={setYOffset}
          server={server}
          setServer={setServer}
          xSpeedThreshold={xSpeedThreshold}
          ySpeedThreshold={ySpeedThreshold}
          setXSpeedThreshold={setXSpeedThreshold}
          setYSpeedThreshold={setYSpeedThreshold}
          setScale={setScale}
          setCanvasSize={setCanvasSize}
        />
      </div>
      <style jsx>{`
        .canvas-wrapper {
          cursor: ${!debuggerVisibility && "none"};
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(${-xTranslate}%, ${-yTranslate}%);
        }
      `}</style>
    </>
  );
}
