import { Bbox } from "@/types/BboxClass";
import { Person } from "@/types/PersonClass";

export const parseResponse = (data: string) => {
  try {
    const parsedData = JSON.parse(data);

    if (Array.isArray(parsedData)) {
      const formattedResults = parsedData.map((item) => {
        // poseが存在するか確認し、PoseDataとして変換
        const pose: PoseData | null = item.pose
          ? {
              keypoints: item.pose.keypoints.map((kpt: [number, number]) => ({
                x: kpt[0],
                y: kpt[1],
              })),
              confidence: item.pose.confidence.map((conf: number) => conf), // confidenceをそのまま扱う
            }
          : null;

        return new Person(
          item.id,
          item.speed,
          new Bbox(item.bbox.confidence, item.bbox.bbox),
          {
            char: item.displayCharacter.char,
            x: item.displayCharacter.x,
            y: item.displayCharacter.y,
            s: item.displayCharacter.s,
          },
          item.movingStatus,
          pose // PoseDataを渡す
        );
      });

      return formattedResults;
    } else {
      console.error("Unexpected data format: ", parsedData);
      return [];
    }
  } catch (error) {
    console.error("Error parsing JSON: ", error);
    return [];
  }
};
