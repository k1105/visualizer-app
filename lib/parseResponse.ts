export const parseResponse = (data: string) => {
  try {
    const parsedData = JSON.parse(data);

    // 受信したデータが配列形式であることを想定
    if (Array.isArray(parsedData)) {
      const formattedResults = parsedData.map((item) => ({
        confidence: item.confidence,
        bbox: item.bbox,
      }));

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
