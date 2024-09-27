interface BboxAttribute {
  confidence: number;
  bbox: [number, number, number, number];
}

interface PersonAttribute {
  id: number;
  bbox: Bbox;
}

interface charData {
  char: string;
  x: number;
  y: number;
  s: number;
  name: string;
}
