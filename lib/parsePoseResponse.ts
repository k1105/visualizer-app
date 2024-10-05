export const parsePoseResponse = (data: string): PoseData[] => {
  try {
    const parsedData = JSON.parse(data);

    // 受信したデータが正しい形式かチェック
    if (Array.isArray(parsedData) && parsedData.length > 0) {
      return parsedData[0].keypoints.map(
        (kpt: [number, number][], index: number) => ({
          keypoints: kpt.map((point) => ({
            x: point[0],
            y: point[1],
          })),
          confidence: parsedData[0].confidence[index],
        })
      );
    } else {
      console.error("Unexpected data format for pose: ", parsedData);
      return [];
    }
  } catch (error) {
    console.error("Error parsing pose JSON: ", error);
    return [];
  }
};
