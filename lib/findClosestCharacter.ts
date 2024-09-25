import { charMatrix } from "@/public/data/charMatrix";

export function findClosestCharacter(
  width: number,
  height: number
): { char: string; xOffset: number; yOffset: number } {
  // 5px刻みの近いwidthとheightの組み合わせを探す
  const closestWidth = Math.round(width / 5) * 5;
  const closestHeight = Math.round(height / 5) * 5;

  // widthがマトリックスに存在するか確認
  if (charMatrix[closestWidth]) {
    // heightがマトリックスに存在するか確認
    if (charMatrix[closestWidth][closestHeight]) {
      return charMatrix[closestWidth][closestHeight];
    }
  }

  return { char: "", xOffset: 0, yOffset: 0 };
}
