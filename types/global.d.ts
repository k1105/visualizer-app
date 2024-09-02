interface Bbox {
  confidence: number;
  bbox: [number, number, number, number];
}

interface PersonAttribute {
  id: number;
  speed: number;
  bbox: Bbox;
  center: () => { x: number; y: number };
}

class Person implements PersonAttribute {
  id: number;
  speed: number;
  bbox: Bbox;

  constructor(id: number, speed: number, bbox: Bbox) {
    this.id = id;
    this.speed = speed;
    this.bbox = bbox;
  }

  center() {
    return {
      x: (this.bbox.bbox[0] + this.bbox.bbox[2]) / 2,
      y: (this.bbox.bbox[1] + this.bbox.bbox[3]) / 2,
    };
  }
}
