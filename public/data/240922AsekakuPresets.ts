type Props = {
  name: string;
  xOffset: number;
  yOffset: number;
  scale: number;
  canvasSize: { width: number; height: number };
  server: string;
  xSpeedThreshold: number;
  ySpeedThreshold: number;
};

export const asekakuPresets: Props = {
  name: "240922_asekaku",
  scale: 1,
  xOffset: -296,
  yOffset: -120,
  xSpeedThreshold: 200,
  ySpeedThreshold: 200,
  canvasSize: { width: 1680, height: 1080 },
  server: "192.168.1.10",
};
