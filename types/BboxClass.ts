export class Bbox implements BboxAttribute {
  confidence: number;
  bbox: [number, number, number, number];

  constructor(confidence: number, bbox: [number, number, number, number]) {
    this.confidence = confidence;
    this.bbox = bbox;
  }

  center() {
    return {
      x: (this.bbox[0] + this.bbox[2]) / 2,
      y: (this.bbox[1] + this.bbox[3]) / 2,
    };
  }

  scale(k: number) {
    this.bbox[0] *= k;
    this.bbox[1] *= k;
    this.bbox[2] *= k;
    this.bbox[3] *= k;
  }
}
