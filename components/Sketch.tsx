import * as React from "react";
import { P5CanvasInstance } from "@p5-wrapper/react";
import { NextReactP5Wrapper } from "@p5-wrapper/next";
import { updateRelation } from "@/lib/updateRelation";
import { updatePeople } from "@/lib/updatePeople";
import { visualizeDebugInformation } from "@/lib/visualizeDebugInformation";

class Person implements PersonAttribute {
  id: number;
  speed: number;
  bbox: Bbox;

  constructor(id: number, speed: number, bbox: Bbox) {
    this.id = id;
    this.speed = speed;
    this.bbox = bbox;
  }

  center() {
    return {
      x: (this.bbox.bbox[0] + this.bbox.bbox[2]) / 2,
      y: (this.bbox.bbox[1] + this.bbox.bbox[3]) / 2,
    };
  }
}

class DisplayedPerson extends Person {
  characterId: number;
  lastUpdated: number;

  constructor(id: number, speed: number, bbox: Bbox, lastUpdated: number) {
    super(id, speed, bbox);
    this.characterId = 0;
    this.lastUpdated = lastUpdated;
  }

  update(person: Person) {
    this.bbox = person.bbox;
    this.speed = person.speed;
  }
}

function sketch(p5: P5CanvasInstance) {
  let bboxes: Bbox[] = [];
  let prevBboxes: Bbox[] = [];
  let k = 0; //拡大比率
  let people: Person[] = [];
  let displayedPeople: DisplayedPerson[] = [];
  let personId: number = 0;
  const threshold: number = 100; //どれくらいの値？
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

    prevBboxes = bboxes;
    bboxes = props.bboxes as Bbox[];
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
    p5.background(0);

    for (const person of displayedPeople) {
      const box = person.bbox.bbox;

      p5.textSize(box[3] - box[1]);
      p5.textAlign(p5.CENTER);
      if (
        isAudioEnabled &&
        person.speed > 50 &&
        p5.frameCount - person.lastUpdated > 5
      ) {
        person.characterId++;
        person.lastUpdated = p5.frameCount;
        setTimeout(function () {
          audioList[person.characterId % charList.length].play();
        }, 200);
      }
      p5.text(
        charList[person.characterId % charList.length],
        box[0],
        box[1],
        box[2] - box[0]
      );
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
    <NextReactP5Wrapper
      sketch={sketch}
      bboxes={bboxes}
      isAudioEnabled={isAudioEnabled}
    />
  );
}
