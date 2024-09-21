import * as React from "react";
import { P5CanvasInstance } from "@p5-wrapper/react";
import { NextReactP5Wrapper } from "@p5-wrapper/next";
import { Person } from "@/types/PersonClass";
import { DisplayedPerson } from "@/types/DisplayedPersonClass";
import { Debugger } from "./Debugger";
import { useState, useRef, useCallback } from "react";
import { findClosestCharacter } from "@/lib/findClosestCharacter";

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
  const displayCharacterRef = useRef<string>("i");
  const [textColor, setTextColor] = useState<string>("white");
  const [scale, setScale] = useState<number>(1);
  const [xOffset, setXOffset] = useState<number>(0);
  const [yOffset, setYOffset] = useState<number>(0);
  const [xSpeedThreshold, setXSpeedThreshold] = useState<number>(50);
  const [ySpeedThreshold, setYSpeedThreshold] = useState<number>(50);

  const sketch = useCallback(
    (p5: P5CanvasInstance) => {
      let k = 0; //拡大比率
      const charList = ["L", "へ", "9", "フ", "8", "乙"];
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
        p5.createCanvas(innerWidth, innerHeight);
        p5.fill(textColor);
        p5.noStroke();
        const aspectRatio = innerHeight / innerWidth;

        if (aspectRatio >= inputAspectRatio) {
          k = innerWidth / inputImageSize.x;
        } else {
          k = innerHeight / inputImageSize.y;
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
                person.speed,
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

          p5.textSize(box[3] - box[1]);
          p5.textAlign(p5.CENTER);
          person.updateMovingStatus(xSpeedThreshold, ySpeedThreshold);

          if (person.movingStatus === "paused") {
            const res = findClosestCharacter(
              person.bbox.width() / 10,
              person.bbox.height() / 10
            );
            if (res !== "") displayCharacterRef.current = res;
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
            displayCharacterRef.current =
              charList[person.characterId % charList.length];
          }

          p5.text(displayCharacterRef.current, box[0], box[1], box[2] - box[0]);
        }
      };
    },
    [textColor, xOffset, yOffset, scale, xSpeedThreshold, ySpeedThreshold]
  );

  return (
    <>
      <NextReactP5Wrapper
        sketch={sketch}
        people={people}
        isAudioEnabled={isAudioEnabled}
      />
      <Debugger
        thresholdRef={thresholdRef}
        displayedPeopleRef={displayedPeopleRef}
        setTextColor={setTextColor}
        xOffset={xOffset}
        yOffset={yOffset}
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
      />
    </>
  );
}
