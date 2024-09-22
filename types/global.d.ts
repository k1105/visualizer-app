interface BboxAttribute {
  confidence: number;
  bbox: [number, number, number, number];
}

interface PersonAttribute {
  id: number;
  bbox: Bbox;
}
