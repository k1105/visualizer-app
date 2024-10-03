import { Bbox } from "./BboxClass";

export class Person implements PersonAttribute {
  id: number;
  private speed: { x: number; y: number };
  bbox: Bbox;
  lostFrameCount: number;
  displayCharacter: charData;

  constructor(id: number, speed: { x: number; y: number }, bbox: Bbox) {
    this.id = id;
    this.speed = speed;
    this.bbox = bbox;
    this.lostFrameCount = 0;
    this.displayCharacter = { char: "i", x: 0, y: -0.15, s: 1 };
  }

  getSpeed() {
    return this.speed;
  }

  setSpeed(speed: { x: number; y: number }) {
    this.speed = speed;
  }
}
