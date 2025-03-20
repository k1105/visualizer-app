import {averageBodyAxis} from "@/lib/averageBodyAxis";
import {Bbox} from "./BboxClass";
import {Person} from "./PersonClass";

export class DisplayedPerson extends Person {
  characterId: number;
  smoothedBbox: Bbox | null;
  pausedFrameCount: number;
  previousIndex: number | null;
  private bboxes: Bbox[];
  private bodyAxisHistory: {p1: Point; p2: Point}[] = [];
  bboxHistory: Bbox[];
  characterList: charData[];
  bodyAxis: {p1: Point; p2: Point};

  constructor(
    id: number,
    speed: {x: number; y: number},
    bbox: Bbox,
    displayCharacter: charData,
    pose: PoseData | null
  ) {
    super(id, speed, bbox, displayCharacter, "paused", pose);
    this.characterId = 0;
    this.pausedFrameCount = 0;
    this.bboxes = [bbox];
    this.bboxHistory = [bbox]; //先頭に新しい要素が入ることに留意
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
      if (this.characterList.length > 0) {
        if (this.characterList[0].char !== person.displayCharacter.char) {
          this.characterList.unshift(person.displayCharacter);
          if (this.characterList.length > 6) {
            this.characterList.pop();
          }
        }
      } else {
        this.characterList.push(person.displayCharacter);
      }
    }

    if (this.pose) {
      const p1 = {
        x: (this.pose.keypoints[5].x + this.pose.keypoints[6].x) / 2,
        y: (this.pose.keypoints[5].y + this.pose.keypoints[6].y) / 2,
      };
      const p2 = {
        x: (this.pose.keypoints[11].x + this.pose.keypoints[12].x) / 2,
        y: (this.pose.keypoints[11].y + this.pose.keypoints[12].y) / 2,
      };
      // 軸データを保存
      this.bodyAxisHistory.push({p1, p2});

      // 配列が大きくなりすぎないよう、先頭を捨てる
      if (this.bodyAxisHistory.length > 5) {
        this.bodyAxisHistory.shift();
      }

      // 平均値を計算して代入
      this.bodyAxis = averageBodyAxis(this.bodyAxisHistory);
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
    if (this.smoothedBbox) this.bboxHistory.unshift(this.smoothedBbox);
    if (this.bboxHistory.length > 100) this.bboxHistory.pop();
  }

  aspectRatio() {
    return (
      (this.bbox.bbox[3] - this.bbox.bbox[1]) /
      (this.bbox.bbox[2] - this.bbox.bbox[0])
    );
  }
}
