type Props = {
  xOffset: number;
  yOffset: number;
  scale: number;
  canvasSize: { width: number; height: number };
  server: string;
  xSpeedThreshold: number;
  ySpeedThreshold: number;
};

export const presets: Props = {
  xOffset: 100,
  yOffset: 100,
  scale: 1,
  canvasSize: { width: 1920, height: 1080 },
  server: "192.168.1.10",
  xSpeedThreshold: 200,
  ySpeedThreshold: 200,
};
