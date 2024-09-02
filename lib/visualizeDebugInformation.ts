import { P5CanvasInstance } from "@p5-wrapper/react";

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

export const visualizeDebugInformation = (
  person: Person,
  threshold: number,
  p5: P5CanvasInstance
) => {
  const box = person.bbox.bbox;

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
};
