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
  const step = 30;
  if (person.smoothedBbox) {
    const box = person.smoothedBbox.bbox;
    const boxHistory = person.bboxHistory;
    const h = (box[3] - box[1]) * 1.2;
    p5.push();
    p5.translate(person.displayCharacter.x * h, person.displayCharacter.y * h);
    p5.translate((box[0] + box[2]) / 2, (box[1] + box[3]) / 2);
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
    // console.log(rot);
    if (rotationActive) p5.rotate(rot);
    p5.textSize(h);
    p5.textAlign(p5.CENTER);
    p5.text(
      person.displayCharacter.char,
      (box[0] - box[2]) / 2,
      h * 0.8 + (box[1] - box[3]) / 2,
      box[2] - box[0]
    );
    if (lastCharacterVisibility) {
      person.characterList.forEach((char, index) => {
        if (boxHistory[index * step]) {
          const lastBox = boxHistory[index * step].bbox;
          p5.push();
          p5.textSize((h * index) / 10);
          p5.text(
            char,
            (lastBox[0] - lastBox[2]) / 2,
            h * 0.8 + (lastBox[1] - lastBox[3]) / 2,
            lastBox[2] - lastBox[0]
          );
          p5.pop();
        }
      });
    }

    p5.pop();
  }
};

export default showCharacter;
