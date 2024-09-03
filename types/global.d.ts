interface Bbox {
  confidence: number;
  bbox: [number, number, number, number];
}

interface PersonAttribute {
  id: number;
  speed: { x: number; y: number };
  bbox: Bbox;
  center: () => { x: number; y: number };
}
