import { Bbox } from "./BboxClass";
import { Person } from "./PersonClass";

export class DisplayedPerson extends Person {
  characterId: number;
  lastUpdated: number;
  smoothedBbox: Bbox;
  pausedFrameCount: number;
  previousIndex: number | null;
  private bboxes: Bbox[];

  constructor(
    id: number,
    speed: { x: number; y: number },
    bbox: Bbox,
    lastUpdated: number,
    displayCharacter: charData
  ) {
    super(id, speed, bbox, displayCharacter, "paused");
    this.characterId = 0;
    this.lastUpdated = lastUpdated;
    this.pausedFrameCount = 0;
    this.bboxes = [bbox];
    this.smoothedBbox = bbox;
    this.previousIndex = null;
  }

  update(person: Person) {
    this.bbox = person.bbox;
    this.displayCharacter = person.displayCharacter;
    this.setSpeed(person.getSpeed());
    this.bboxes.push(person.bbox);
    this.movingStatus = person.movingStatus;
    if (this.bboxes.length > 5) this.bboxes.shift();

    const smoothedBbox: Bbox = new Bbox(0, [0, 0, 0, 0]);
    if (this.bboxes.length > 0) {
      for (let i = 0; i < 4; i++) {
        let totalWeight = 0;
        let val = 0;
        for (let j = 0; j < this.bboxes.length; j++) {
          const weight =
            (this.bboxes.length - 1) / 2 -
            Math.abs((this.bboxes.length - 1) / 2 - j) +
            1;
          totalWeight += weight;
          val += this.bboxes[j].bbox[i] * weight;
        }
        smoothedBbox.bbox[i] = val / totalWeight;
      }
      this.smoothedBbox = smoothedBbox;
    } else {
      this.smoothedBbox = this.bbox;
    }
  }

  aspectRatio() {
    return (
      (this.bbox.bbox[3] - this.bbox.bbox[1]) /
      (this.bbox.bbox[2] - this.bbox.bbox[0])
    );
  }
}
