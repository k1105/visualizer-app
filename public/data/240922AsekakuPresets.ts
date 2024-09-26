type Props = {
  name: string;
  xTranslate?: number;
  yTranslate?: number;
  xOffset: number;
  yOffset: number;
  scale: number;
  canvasSize: { width: number; height: number };
  server: string;
  xSpeedThreshold: number;
  ySpeedThreshold: number;
};

export const asekaku_240926: Props = {
  name: "240922_asekaku",
  scale: 1,
  xTranslate: 60.5,
  yTranslate: 49.5,
  xOffset: -296,
  yOffset: -311,
  xSpeedThreshold: 200,
  ySpeedThreshold: 200,
  canvasSize: { width: 1467, height: 1080 },
  server: "192.168.1.10",
};

export const asekaku_240922: Props = {
  name: "240922_asekaku",
  scale: 1,
  xOffset: -296,
  yOffset: -311,
  xSpeedThreshold: 200,
  ySpeedThreshold: 200,
  canvasSize: { width: 1680, height: 1080 },
  server: "192.168.1.10",
};

export const default_preset: Props = {
  name: "default (1920 x 1080)",
  scale: 1,
  xOffset: 0,
  yOffset: 0,
  xSpeedThreshold: 0,
  ySpeedThreshold: 0,
  canvasSize: { width: 1920, height: 1080 },
  server: "localhost",
};
