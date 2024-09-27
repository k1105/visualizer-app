import { DisplayedPerson } from "@/types/DisplayedPersonClass";
import { P5CanvasInstance } from "@p5-wrapper/react";

const showCharacter = ({
  person,
  p5,
}: {
  person: DisplayedPerson;
  p5: P5CanvasInstance;
}) => {
  const box = person.smoothedBbox.bbox;
  const h = (box[3] - box[1]) * 1.2;
  p5.push();
  p5.translate(person.displayCharacter.x * h, person.displayCharacter.y * h);
  p5.textSize(h);
  p5.textAlign(p5.CENTER);
  p5.text(
    person.displayCharacter.char,
    box[0],
    box[1] + h * 0.8,
    box[2] - box[0]
  );
  p5.pop();
};

export default showCharacter;
