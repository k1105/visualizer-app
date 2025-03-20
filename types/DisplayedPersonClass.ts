import {Bbox} from "./BboxClass";
import {Person} from "./PersonClass";

export class DisplayedPerson extends Person {
  characterId: number;
  lastUpdated: number;
  smoothedBbox: Bbox | null;
  pausedFrameCount: number;
  previousIndex: number | null;
  private bboxes: Bbox[];
  characterList: string[];
  bodyAxis: {p1: Point; p2: Point};

  constructor(
    id: number,
    speed: {x: number; y: number},
    bbox: Bbox,
    lastUpdated: number,
    displayCharacter: charData,
    pose: PoseData | null
  ) {
    super(id, speed, bbox, displayCharacter, "paused", pose);
    this.characterId = 0;
    this.lastUpdated = lastUpdated;
    this.pausedFrameCount = 0;
    this.bboxes = [bbox];
    this.smoothedBbox = null;
    this.previousIndex = null;
    this.characterList = [];
    this.bodyAxis = {p1: {x: 0, y: 0}, p2: {x: 0, y: 0}};
  }

  update(person: Person) {
    this.bbox = person.bbox;
    this.pose = person.pose;
    this.displayCharacter = person.displayCharacter;
    this.setSpeed(person.getSpeed());
    this.bboxes.push(person.bbox);
    this.movingStatus = person.movingStatus;
    if (this.bboxes.length > 5) this.bboxes.shift();
    if (person.displayCharacter.char !== "") {
      const listLength = this.characterList.length;
      if (listLength > 0) {
        if (
          this.characterList[listLength - 1] !== person.displayCharacter.char
        ) {
          this.characterList.push(person.displayCharacter.char);
          if (listLength + 1 > 6) {
            this.characterList.shift();
          }
        }
      } else {
        this.characterList.push(person.displayCharacter.char);
      }
    }

    if (this.pose) {
      const p1 = {
        x: (this.pose.keypoints[5].x + this.pose.keypoints[6].x) / 2,
        y: (this.pose.keypoints[5].y + this.pose.keypoints[6].y) / 2,
      };
      const p2 = {
        x: (this.pose.keypoints[11].x + this.pose.keypoints[12].x) / 2,
        y: (this.pose.keypoints[12].y + this.pose.keypoints[12].y) / 2,
      };
      this.bodyAxis = {p1: p1, p2: p2};
    }

    const smoothedBbox: Bbox = new Bbox(0, [0, 0, 0, 0]);
    if (this.bboxes.length >= 5) {
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
    }
  }

  aspectRatio() {
    return (
      (this.bbox.bbox[3] - this.bbox.bbox[1]) /
      (this.bbox.bbox[2] - this.bbox.bbox[0])
    );
  }
}
