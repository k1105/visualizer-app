import { P5CanvasInstance } from "@p5-wrapper/react";
import { DisplayedPerson } from "@/types/DisplayedPersonClass";

export const visualizeDebugInformation = (
  person: DisplayedPerson,
  threshold: number,
  p5: P5CanvasInstance
) => {
  const box = person.smoothedBbox().bbox;
  const bboxCenter = person.smoothedBbox().center();

  p5.push();
  p5.textAlign(p5.LEFT);
  p5.translate(20, 50);
  p5.textSize(20);
  p5.text("id: " + person.id, box[0], box[1]);
  p5.translate(0, 30);
  p5.text("speed-x: " + Math.floor(person.speed.x * 100) / 100, box[0], box[1]);
  p5.translate(0, 30);
  p5.text("speed-y: " + Math.floor(person.speed.y * 100) / 100, box[0], box[1]);
  p5.pop();

  p5.push();
  p5.noFill();
  p5.stroke(0, 255, 0);
  p5.circle(bboxCenter.x, bboxCenter.y, threshold * 2);
  p5.stroke(255, 0, 0);
  p5.rect(box[0], box[1], box[2] - box[0], box[3] - box[1]);
  p5.pop();
};
