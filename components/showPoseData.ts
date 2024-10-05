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
    p5.circle(point.x * scale, point.y * scale, 10);
  }
  p5.pop();
};

export default showPoseData;
