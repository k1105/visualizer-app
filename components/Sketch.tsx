import * as React from "react";
import { P5CanvasInstance } from "@p5-wrapper/react";
import { NextReactP5Wrapper } from "@p5-wrapper/next";
import { updateRelation } from "@/lib/updateRelation";
import { updatePeople } from "@/lib/updatePeople";
import { Person } from "@/types/PersonClass";
import { Bbox } from "@/types/BboxClass";
import { DisplayedPerson } from "@/types/DisplayedPersonClass";
import { Debugger } from "./Debugger";
import { useState, useEffect, useRef, useCallback } from "react";

export function Sketch({
  bboxes,
  isAudioEnabled,
}: {
  bboxes: Bbox[];
  isAudioEnabled: boolean;
}) {
  const thresholdRef = useRef<number>(200);
  const peopleRef = useRef<Person[]>([]);
  const displayedPeopleRef = useRef<DisplayedPerson[]>([]);
  const [textColor, setTextColor] = useState<string>("white");
  const [scale, setScale] = useState<number>(1);
  const [xOffset, setXOffset] = useState<number>(0);
  const [yOffset, setYOffset] = useState<number>(0);
  const [xSpeedThreshold, setXSpeedThreshold] = useState<number>(30);
  const [ySpeedThreshold, setYSpeedThreshold] = useState<number>(30);

  const sketch = useCallback(
    (p5: P5CanvasInstance) => {
      let bboxes: Bbox[] = [];
      let k = 0; //拡大比率
      let personId: number = 0;
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

        bboxes = (props.bboxes as BboxAttribute[]).map(
          (bbox: BboxAttribute) => new Bbox(bbox.confidence, bbox.bbox)
        );
        for (let i = 0; i < bboxes.length; i++) {
          bboxes[i].bbox[0] *= k * (props.scale as number);
          bboxes[i].bbox[1] *= k * (props.scale as number);
          bboxes[i].bbox[2] *= k * (props.scale as number);
          bboxes[i].bbox[3] *= k * (props.scale as number);
        }

        const relation: { id: number; dist: number }[][] = updateRelation({
          people: peopleRef.current,
          bboxes,
          threshold: thresholdRef.current,
        });

        const res = updatePeople({
          relation,
          people: peopleRef.current,
          bboxes,
          personId,
        });

        peopleRef.current = res.people;

        displayedPeopleRef.current = displayedPeopleRef.current.filter(
          (displayedPerson) =>
            peopleRef.current.some((person) => person.id === displayedPerson.id)
        );

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
        personId = res.personId;
      };

      p5.draw = () => {
        p5.clear();
        p5.translate(xOffset, yOffset);
        // p5.background(255, 0, 0);

        for (const person of displayedPeopleRef.current) {
          const box = person.smoothedBbox.bbox;
          // const box = person.bbox.bbox;
          let displayCharacter = "";

          p5.textSize(box[3] - box[1]);
          p5.textAlign(p5.CENTER);
          if (
            isAudioEnabled &&
            (Math.abs(person.speed.x) > xSpeedThreshold ||
              person.movingStatus === "walking")
          ) {
            person.movingStatus = "walking";

            if (p5.frameCount - person.lastUpdated > 5) {
              person.characterId++;
              person.lastUpdated = p5.frameCount;
              setTimeout(function () {
                audioList[person.characterId % charList.length].play();
              }, 200);
              person.pausedFrameCount = 0;
            }
            displayCharacter = charList[person.characterId % charList.length];
          }

          if (
            Math.abs(person.speed.x) < xSpeedThreshold &&
            Math.abs(person.speed.y) < ySpeedThreshold
          ) {
            person.pausedFrameCount++;
            if (person.pausedFrameCount > 3) {
              person.movingStatus = "paused";
            }
          }

          if (person.movingStatus === "paused") {
            if (person.aspectRatio() > 2) {
              displayCharacter = "l";
            } else {
              displayCharacter = "T";
            }
          }

          p5.text(displayCharacter, box[0], box[1], box[2] - box[0]);
        }
      };
    },
    [textColor, xOffset, yOffset]
  );

  return (
    <>
      <NextReactP5Wrapper
        sketch={sketch}
        bboxes={bboxes}
        isAudioEnabled={isAudioEnabled}
        scale={scale}
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
        xSpeedThreshold={xSpeedThreshold}
        ySpeedThreshold={ySpeedThreshold}
        setXSpeedThreshold={setXSpeedThreshold}
        setYSpeedThreshold={setYSpeedThreshold}
        setScale={setScale}
      />
    </>
  );
}
