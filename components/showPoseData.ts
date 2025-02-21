import { P5CanvasInstance } from "@p5-wrapper/react";

const showPoseData = ({
  pose,
  p5,
  scale,
}: {
  pose: PoseData;
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
  const p1 = {
    x: pose.keypoints[5].x + (pose.keypoints[5].x + pose.keypoints[6].x) / 2,
    y: pose.keypoints[5].y + (pose.keypoints[5].y + pose.keypoints[6].y) / 2,
  };
  const p2 = {
    x: pose.keypoints[11].x + (pose.keypoints[11].x + pose.keypoints[12].x) / 2,
    y: pose.keypoints[11].y + (pose.keypoints[12].y + pose.keypoints[12].y) / 2,
  };
  p5.line(p1.x, p1.y, p2.x, p2.y);
  p5.pop();
};

export default showPoseData;
