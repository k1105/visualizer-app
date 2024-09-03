interface BboxAttribute {
  confidence: number;
  bbox: [number, number, number, number];
}

interface PersonAttribute {
  id: number;
  speed: { x: number; y: number };
  bbox: Bbox;
}
