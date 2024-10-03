import { characterData } from "@/public/data/characterData";

type MovingStatus = "paused" | "walking";

export default function findCharacter(
  width: number,
  height: number,
  movingStatus: MovingStatus,
  previousIndex: number | null
): { charData: charData; index: number | null } {
  const aspectRatio = width / height;
  let closestIndex = 0;
  let minDifference = Infinity;

  // Find the closest aspect ratio
  characterData.forEach((data, index) => {
    const diff = Math.abs(aspectRatio - data.aspectRatio);
    if (diff < minDifference) {
      minDifference = diff;
      closestIndex = index;
    }
  });

  // Select the appropriate character list based on movingStatus
  const selectedCharacters =
    movingStatus === "walking"
      ? characterData[closestIndex].movingCharacter
      : characterData[closestIndex].pausedCharacter;

  // Return the previous character if we're still in the same "closest" cell
  if (closestIndex !== previousIndex && selectedCharacters.length > 0) {
    if (selectedCharacters.length == 1) {
      return { charData: selectedCharacters[0], index: closestIndex }; // Or you can store and return the last selected character
    } else {
      // Randomly pick a character if multiple are available
      const randomCharacter =
        selectedCharacters[
          Math.floor(Math.random() * selectedCharacters.length)
        ];

      return { charData: randomCharacter, index: closestIndex };
    }
  } else {
    return {
      charData: { char: "", x: 0, y: 0, s: 0, name: "none" },
      index: closestIndex,
    };
  }
}
