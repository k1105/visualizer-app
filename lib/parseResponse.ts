import { Bbox } from "@/types/BboxClass";
import { Person } from "@/types/PersonClass";

export const parseResponse = (data: string) => {
  try {
    const parsedData = JSON.parse(data);

    // 受信したデータが配列形式であることを想定
    if (Array.isArray(parsedData)) {
      const formattedResults = parsedData.map(
        (item) =>
          new Person(
            item.id,
            item.speed,
            new Bbox(item.bbox.confidence, item.bbox.bbox),
            {
              char: item.displayCharacter.char,
              x: item.displayCharacter.x,
              y: item.displayCharacter.y,
              s: item.displayCharacter.s,
            }
          )
      );

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
