import * as React from "react";
import { P5CanvasInstance } from "@p5-wrapper/react";
import { NextReactP5Wrapper } from "@p5-wrapper/next";
import { updateRelation } from "@/lib/updateRelation";
import { updatePeople } from "@/lib/updatePeople";

interface Bbox {
  confidence: number;
  bbox: [number, number, number, number];
}

interface PersonAttribute {
  id: number;
  speed: number;
  bbox: Bbox;
  center: () => { x: number; y: number };
}

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

function sketch(p5: P5CanvasInstance) {
  let bboxes: Bbox[] = [];
  let prevBboxes: Bbox[] = [];
  let k = 0; //拡大比率
  let people: Person[] = [];
  let personId: number = 0;
  const threshold: number = 250; //どれくらいの値？

  const inputImageSize = { x: 1280, y: 720 }; //defaultのmacwebcam: 1280 x720, test用の動画ファイル：2366 × 1348
  const inputAspectRatio = inputImageSize.y / inputImageSize.x;

  p5.setup = () => {
    p5.createCanvas(innerWidth, innerHeight);
    p5.fill(250);
    p5.noStroke();
    const aspectRatio = innerHeight / innerWidth;

    //カンバスサイズとinputのフレームサイズに基づいて拡大比率を設定

    if (aspectRatio >= inputAspectRatio) {
      k = innerWidth / inputImageSize.x;
    } else {
      k = innerHeight / inputImageSize.y;
    }
  };

  p5.updateWithProps = (props) => {
    // START: update Bboxes
    prevBboxes = bboxes;
    bboxes = props.bboxes as Bbox[];
    for (let i = 0; i < bboxes.length; i++) {
      bboxes[i].bbox[0] *= k;
      bboxes[i].bbox[1] *= k;
      bboxes[i].bbox[2] *= k;
      bboxes[i].bbox[3] *= k;
    }
    // FINISH: update Bboxes

    // update relation
    const relation: { id: number; dist: number }[][] = updateRelation({
      people,
      bboxes,
      threshold,
    });
    // FINISH: update relation

    const res = updatePeople({ relation, people, bboxes, personId });

    people = res.people;
    personId = res.personId;
  };

  p5.draw = () => {
    p5.background(0);

    for (const person of people) {
      const box = person.bbox.bbox;

      p5.textSize(box[3] - box[1]);
      p5.textAlign(p5.CENTER);
      p5.text(person.id, box[0], box[1], box[2] - box[0]);
      p5.push();
      p5.noFill();
      p5.stroke(255);
      p5.circle((box[2] + box[0]) / 2, (box[1] + box[3]) / 2, threshold * 2);
      p5.pop();
    }
  };
}

export function Sketch({ bboxes }: { bboxes: Bbox[] }) {
  return <NextReactP5Wrapper sketch={sketch} bboxes={bboxes} />;
}
