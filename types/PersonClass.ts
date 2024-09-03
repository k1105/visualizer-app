import { Bbox } from "./BboxClass";

export class Person implements PersonAttribute {
  id: number;
  speed: { x: number; y: number };
  bbox: Bbox;
  lostFrameCount: number;

  constructor(id: number, speed: { x: number; y: number }, bbox: Bbox) {
    this.id = id;
    this.speed = speed;
    this.bbox = bbox;
    this.lostFrameCount = 0;
  }
}
