import { P5CanvasInstance } from "@p5-wrapper/react";
import { NextReactP5Wrapper } from "@p5-wrapper/next";
import { MutableRefObject, RefObject, useCallback } from "react";
import { DisplayedPerson } from "@/types/DisplayedPersonClass";

const Guide = ({
  frameRateTextRef,
  thresholdTextRef,
  thresholdRef,
  offset,
  displayedPeopleRef,
  canvasSize,
}: {
  frameRateTextRef: RefObject<HTMLParagraphElement>;
  thresholdTextRef: RefObject<HTMLParagraphElement>;
  thresholdRef: MutableRefObject<number>;
  offset: { x: number; y: number };
  displayedPeopleRef: MutableRefObject<DisplayedPerson[]>;
  canvasSize: { width: number; height: number };
}) => {
  const sketch = useCallback(
    (p5: P5CanvasInstance) => {
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
      };

      p5.draw = () => {
        frameRateTextRef.current!.innerText = `${Math.floor(p5.frameRate())}`;
        thresholdTextRef.current!.innerText = `${thresholdRef.current}`;

        p5.clear();
        p5.textSize(16);
        p5.textAlign(p5.LEFT);

        p5.push();
        p5.stroke(255, 0, 0);
        p5.strokeWeight(10);
        p5.noFill();
        p5.rect(0, 0, p5.width, p5.height);
        p5.pop();

        p5.translate(offset.x, offset.y);

        for (const person of displayedPeopleRef.current) {
          const box = person.smoothedBbox.bbox;
          const bboxCenter = person.smoothedBbox.center();
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
          p5.pop();

          p5.push();
          p5.noFill();
          p5.stroke(0, 255, 0);
          if (person.movingStatus == "walking") {
            p5.strokeWeight(10);
          }
          // p5.circle(bboxCenter.x, bboxCenter.y, thresholdRef.current * 2);
          p5.stroke("#3D72AA");
          p5.rect(box[0], box[1], box[2] - box[0], box[3] - box[1]);
          p5.strokeWeight(1);
          p5.drawingContext.setLineDash([5, 5]);
          p5.line(bboxCenter.x, box[1], bboxCenter.x, box[3]);
          p5.line(box[0], bboxCenter.y, box[2], bboxCenter.y);
          p5.pop();
        }
      };
    },
    [
      frameRateTextRef,
      thresholdTextRef,
      thresholdRef,
      displayedPeopleRef,
      offset,
    ]
  );

  return (
    <>
      <div className="canvas-wrapper">
        <NextReactP5Wrapper
          sketch={sketch}
          canvasWidth={canvasSize.width}
          canvasHeight={canvasSize.height}
        />
      </div>
      <style jsx>{`
        .canvas-wrapper {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 90;
        }
      `}</style>
    </>
  );
};

export default Guide;
