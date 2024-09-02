import * as React from "react";
import { P5CanvasInstance } from "@p5-wrapper/react";
import { NextReactP5Wrapper } from "@p5-wrapper/next";
import { updateRelation } from "@/lib/updateRelation";
import { updatePeople } from "@/lib/updatePeople";

function sketch(p5: P5CanvasInstance) {
  let bboxes: Bbox[] = [];
  let prevBboxes: Bbox[] = [];
  let k = 0; //拡大比率
  let people: Person[] = [];
  let personId: number = 0;
  const threshold: number = 100; //どれくらいの値？

  const inputImageSize = { x: 2366, y: 1348 }; //defaultのmacwebcam: 1280 x720, test用の動画ファイル：2366 × 1348
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

    console.log(relation);

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
      p5.text("人", box[0], box[1], box[2] - box[0]);

      p5.push();
      p5.textAlign(p5.LEFT);
      p5.translate(20, 50);
      p5.textSize(20);
      p5.text("id: " + person.id, box[0], box[1]);
      p5.translate(0, 30);
      p5.text("speed: " + Math.floor(person.speed * 100) / 100, box[0], box[1]);
      p5.pop();

      p5.push();
      p5.noFill();
      p5.stroke(0, 255, 0);
      p5.circle((box[2] + box[0]) / 2, (box[1] + box[3]) / 2, threshold * 2);
      p5.stroke(255, 0, 0);
      p5.rect(box[0], box[1], box[2] - box[0], box[3] - box[1]);
      p5.pop();
    }
  };
}

export function Sketch({ bboxes }: { bboxes: Bbox[] }) {
  return <NextReactP5Wrapper sketch={sketch} bboxes={bboxes} />;
}
