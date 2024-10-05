import { Bbox } from "./BboxClass";

export class Person implements PersonAttribute {
  id: number;
  private speed: { x: number; y: number };
  bbox: Bbox;
  lostFrameCount: number;
  displayCharacter: charData;
  movingStatus: "walking" | "paused";
  pose: PoseData | null;

  constructor(
    id: number,
    speed: { x: number; y: number },
    bbox: Bbox,
    displayCharacter: charData,
    movingStatus: "walking" | "paused",
    pose: PoseData | null
  ) {
    this.id = id;
    this.speed = speed;
    this.bbox = bbox;
    this.lostFrameCount = 0;
    this.displayCharacter = displayCharacter;
    this.movingStatus = movingStatus;
    this.pose = pose;
  }

  getSpeed() {
    return this.speed;
  }

  setSpeed(speed: { x: number; y: number }) {
    this.speed = speed;
  }
}
