import * as React from "react";
import { P5CanvasInstance } from "@p5-wrapper/react";
import { NextReactP5Wrapper } from "@p5-wrapper/next";
import { updateRelation } from "@/lib/updateRelation";
import { updatePeople } from "@/lib/updatePeople";
import { visualizeDebugInformation } from "@/lib/visualizeDebugInformation";
import { Monitor } from "./Monitor";
import { Person } from "@/types/PersonClass";
import { Bbox } from "@/types/BboxClass";
import { DisplayedPerson } from "@/types/DisplayedPersonClass";

function sketch(p5: P5CanvasInstance) {
  let bboxes: Bbox[] = [];
  let k = 0; //拡大比率
  let people: Person[] = [];
  let displayedPeople: DisplayedPerson[] = [];
  let personId: number = 0;
  const threshold: number = 200; //どれくらいの値？
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
    p5.fill(250);
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
      bboxes[i].bbox[0] *= k;
      bboxes[i].bbox[1] *= k;
      bboxes[i].bbox[2] *= k;
      bboxes[i].bbox[3] *= k;
    }

    const relation: { id: number; dist: number }[][] = updateRelation({
      people,
      bboxes,
      threshold,
    });

    const res = updatePeople({ relation, people, bboxes, personId });

    people = res.people;

    displayedPeople = displayedPeople.filter((displayedPerson) =>
      people.some((person) => person.id === displayedPerson.id)
    );

    for (const person of people) {
      const displayedPerson = displayedPeople.find((p) => p.id === person.id);

      if (displayedPerson) {
        displayedPerson.update(person);
      } else {
        displayedPeople.push(
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

    for (const person of displayedPeople) {
      const box = person.smoothedBbox().bbox;
      let displayCharacter = "";

      p5.textSize(box[3] - box[1]);
      p5.textAlign(p5.CENTER);
      if (
        isAudioEnabled &&
        (Math.abs(person.speed.x) > 50 || person.movingStatus === "walking")
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

      if (Math.abs(person.speed.x) < 30 && Math.abs(person.speed.y) < 30) {
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

      visualizeDebugInformation(person, threshold, p5);
    }
  };
}

export function Sketch({
  bboxes,
  isAudioEnabled,
}: {
  bboxes: Bbox[];
  isAudioEnabled: boolean;
}) {
  return (
    <>
      <NextReactP5Wrapper
        sketch={sketch}
        bboxes={bboxes}
        isAudioEnabled={isAudioEnabled}
      />
      <Monitor />
    </>
  );
}
