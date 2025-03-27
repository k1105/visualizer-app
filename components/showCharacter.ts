import {DisplayedPerson} from "@/types/DisplayedPersonClass";
import {P5CanvasInstance} from "@p5-wrapper/react";

const showCharacter = ({
  person,
  p5,
  rotationActive,
  lastCharacterVisibility,
}: {
  person: DisplayedPerson;
  p5: P5CanvasInstance;
  rotationActive: boolean;
  lastCharacterVisibility: boolean;
}) => {
  const step = 20;
  const rot =
    person.bodyAxis.p1.x *
      person.bodyAxis.p1.y *
      person.bodyAxis.p2.x *
      person.bodyAxis.p2.y !==
    0
      ? Math.atan2(
          person.bodyAxis.p1.y - person.bodyAxis.p2.y,
          person.bodyAxis.p1.x - person.bodyAxis.p2.x
        ) +
        Math.PI / 2
      : 0;
  p5.textAlign(p5.CENTER);
  if (person.smoothedBbox) {
    const boxHistory = person.bboxHistory;
    // person.characterList.forEach((char, index) => {
    person.characterList.forEach((charData, index) => {
      if (
        index == 0 ||
        lastCharacterVisibility // && person.movingStatus === "walking"
      ) {
        if (boxHistory[index * step]) {
          if (index > 0) p5.textAlign(p5.LEFT);
          p5.push();
          const lastBox = boxHistory[index * step].bbox;
          const h = (lastBox[3] - lastBox[1]) * 1.2;

          p5.fill(255, 255, 255, 255 * 0.8 ** index);
          p5.translate(
            charData.x * h + (lastBox[0] + lastBox[2]) / 2,
            charData.y * h + (lastBox[1] + lastBox[3]) / 2
          );
          if (rotationActive && person.pose && index == 0) p5.rotate(rot);
          if (index === 0) {
            p5.textSize(h);
          } else {
            p5.textSize(h * 0.4 * 0.9 ** index);
          }
          p5.text(
            charData.char,
            (lastBox[0] - lastBox[2]) / 2,
            h * 0.8 + (lastBox[1] - lastBox[3]) / 2,
            lastBox[2] - lastBox[0]
          );
          p5.pop();
        }
      }
    });
  }
};

export default showCharacter;
