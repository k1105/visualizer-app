import { charMatrix } from "@/public/data/charMatrix";

export function findClosestCharacter(width: number, height: number): string {
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

  // 該当がない場合は空文字を返す
  return "";
}
