import { DisplayedPerson } from "@/types/DisplayedPersonClass";
import { P5CanvasInstance } from "@p5-wrapper/react";

const showBoundingBox = ({
  person,
  p5,
}: {
  person: DisplayedPerson;
  p5: P5CanvasInstance;
}) => {
  const box = person.smoothedBbox.bbox;
  const bboxCenter = person.smoothedBbox.center();
  p5.push();
  p5.noFill();
  p5.stroke(0, 255, 0);
  if (person.movingStatus == "walking") {
    p5.strokeWeight(10);
  }
  // p5.circle(bboxCenter.x, bboxCenter.y, thresholdRef.current * 2);
  p5.stroke("#ffffff");
  p5.rect(box[0], box[1], box[2] - box[0], box[3] - box[1]);
  p5.strokeWeight(1);
  p5.drawingContext.setLineDash([5, 5]);
  p5.line(bboxCenter.x, box[1], bboxCenter.x, box[3]);
  p5.line(box[0], bboxCenter.y, box[2], bboxCenter.y);
  p5.pop();
};

export default showBoundingBox;
