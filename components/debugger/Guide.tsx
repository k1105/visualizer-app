import {P5CanvasInstance} from "@p5-wrapper/react";
import {NextReactP5Wrapper} from "@p5-wrapper/next";
import {RefObject, useCallback} from "react";
import {useProperty} from "../context/PropertyContext";

const Guide = ({
  frameRateTextRef,
  canvasSize,
}: {
  frameRateTextRef: RefObject<HTMLParagraphElement>;
  canvasSize: {width: number; height: number};
}) => {
  const {translate, displayedPeopleRef, offset} = useProperty();
  const sketch = useCallback(
    (p5: P5CanvasInstance) => {
      let p5Offset: {x: number; y: number} = {x: 0, y: 0};

      p5.setup = () => {
        p5.createCanvas(p5.windowWidth, p5.windowHeight);
        p5.fill(255);
      };

      p5.updateWithProps = (props) => {
        if (props.canvasWidth && props.canvasHeight) {
          p5.resizeCanvas(
            Number(props.canvasWidth),
            Number(props.canvasHeight)
          );
        }

        if (props.offset) {
          p5Offset = props.offset as {x: number; y: number};
        }
      };

      p5.draw = () => {
        frameRateTextRef.current!.innerText = `${Math.floor(p5.frameRate())}`;

        p5.clear();
        p5.textSize(16);
        p5.textAlign(p5.LEFT);
        p5.push();
        p5.stroke(255, 0, 0);
        p5.strokeWeight(10);
        p5.noFill();
        p5.rect(0, 0, p5.width, p5.height);
        p5.strokeWeight(3);
        p5.line(0, p5.height / 2, p5.width, p5.height / 2);
        p5.line(p5.width / 2, 0, p5.width / 2, p5.height);
        p5.pop();

        p5.push();
        p5.translate(p5Offset.x, p5Offset.y);

        for (const person of displayedPeopleRef.current) {
          if (person.smoothedBbox) {
            const box = person.smoothedBbox.bbox;
            const speed = person.getSpeed();
            p5.push();
            p5.textAlign(p5.LEFT);
            p5.translate(20, 50);
            p5.textSize(20);
            p5.text("id: " + person.id, box[0], box[1]);
            p5.translate(0, 30);
            p5.text(
              "speed-x: " + Math.floor(speed.x * 100) / 100,
              box[0],
              box[1]
            );
            p5.translate(0, 30);
            p5.text(
              "speed-y: " + Math.floor(speed.y * 100) / 100,
              box[0],
              box[1]
            );
            p5.translate(0, 30);
            p5.text(
              `bbox-size: ${Math.floor(person.bbox.width() * 100) / 100} x ${
                Math.floor(person.bbox.height() * 100) / 100
              }`,
              box[0],
              box[1]
            );
            p5.translate(0, 30);
            p5.text(
              `characters: ${person.characterList}
              `,
              box[0],
              box[1]
            );
            p5.pop();
          }
        }

        p5.pop();
      };
    },
    [frameRateTextRef, displayedPeopleRef]
  );

  return (
    <>
      <div className="canvas-wrapper">
        <NextReactP5Wrapper
          sketch={sketch}
          canvasWidth={canvasSize.width}
          canvasHeight={canvasSize.height}
          offset={offset}
        />
      </div>
      <style jsx>{`
        .canvas-wrapper {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-${translate.x}%, -${translate.y}%);
          z-index: 90;
        }
      `}</style>
    </>
  );
};

export default Guide;
