import {P5CanvasInstance} from "@p5-wrapper/react";

const showPoseData = ({
  pose,
  bodyAxis,
  p5,
  scale,
}: {
  pose: PoseData;
  bodyAxis: {p1: Point; p2: Point};
  p5: P5CanvasInstance;
  scale: number;
}) => {
  p5.push();
  p5.noStroke();
  p5.fill(255);
  for (const point of pose.keypoints) {
    console.log(point);
    if (point.x !== 0 && point.y !== 0)
      p5.circle(point.x * scale, point.y * scale, 10);
  }
  p5.stroke(255);
  if (
    bodyAxis.p1.x !== 0 &&
    bodyAxis.p2.x !== 0 &&
    bodyAxis.p1.y !== 0 &&
    bodyAxis.p2.y !== 0
  ) {
    p5.line(
      bodyAxis.p1.x * scale,
      bodyAxis.p1.y * scale,
      bodyAxis.p2.x * scale,
      bodyAxis.p2.y * scale
    );
  }
  p5.pop();
};

export default showPoseData;
