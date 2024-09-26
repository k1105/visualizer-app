type Props = {
  name: string;
  translate?: { x: number; y: number };
  offset: { x: number; y: number };
  scale: number;
  canvasSize: { width: number; height: number };
  server: string;
  speedThreshold: { x: number; y: number };
};

export const asekaku_240926: Props = {
  name: "240926_asekaku",
  scale: 1,
  translate: { x: 57.5, y: 49 },
  offset: { x: -296, y: -311 },
  speedThreshold: { x: 200, y: 200 },
  canvasSize: { width: 1601, height: 1021 },
  server: "192.168.1.10",
};

export const asekaku_240922: Props = {
  name: "240922_asekaku",
  scale: 1,
  offset: { x: -296, y: -311 },
  speedThreshold: { x: 200, y: 200 },
  canvasSize: { width: 1680, height: 1080 },
  server: "192.168.1.10",
};

export const default_preset: Props = {
  name: "default (1920 x 1080)",
  scale: 1,
  offset: { x: 0, y: 0 },
  speedThreshold: { x: 0, y: 0 },
  canvasSize: { width: 1920, height: 1080 },
  server: "localhost",
};
