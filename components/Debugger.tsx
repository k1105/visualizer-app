import { P5CanvasInstance } from "@p5-wrapper/react";
import { DisplayedPerson } from "@/types/DisplayedPersonClass";
import { NextReactP5Wrapper } from "@p5-wrapper/next";
import {
  MutableRefObject,
  useCallback,
  useRef,
  useState,
  useEffect,
} from "react";
import { Monitor } from "./Monitor";
import { ColorPalette } from "./ColorPalette";
import { VisibilityOn } from "./icon/VisibilityOn";
import { VisibilityOff } from "./icon/VisibilityOff";
import { RadioOn } from "./icon/RadioOn";
import { RadioOff } from "./icon/RadioOff";

type Props = {
  thresholdRef: MutableRefObject<number>;
  displayedPeopleRef: MutableRefObject<DisplayedPerson[]>;
  setTextColor: (color: string) => void;
  scale: number;
  xOffset: number;
  yOffset: number;
  canvasSize: { width: number; height: number };
  server: string;
  xSpeedThreshold: number;
  ySpeedThreshold: number;
  setScale: (scale: number) => void;
  setXOffset: (offset: number) => void;
  setYOffset: (offset: number) => void;
  setServer: (server: string) => void;
  setXSpeedThreshold: (threshold: number) => void;
  setYSpeedThreshold: (threshold: number) => void;
  setCanvasSize: (size: { width: number; height: number }) => void;
};

export const Debugger = ({
  thresholdRef,
  displayedPeopleRef,
  scale,
  xOffset,
  yOffset,
  server,
  canvasSize,
  xSpeedThreshold,
  ySpeedThreshold,
  setTextColor,
  setScale,
  setXOffset,
  setYOffset,
  setServer,
  setXSpeedThreshold,
  setYSpeedThreshold,
  setCanvasSize,
}: Props) => {
  const thresholdTextRef = useRef<HTMLParagraphElement>(null);
  const frameRateTextRef = useRef<HTMLParagraphElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>("black");
  const [cameraResolution, setCameraResolution] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const [align, setAlign] = useState<string>("left");
  const [cameraVisibility, setCameraVisibility] = useState<boolean>(true);
  const [guideVisibility, setGuideVisibility] = useState<boolean>(true);
  const [debuggerVisibility, setDebuggerVisibility] = useState<boolean>(true);
  const [showMessage, setShowMessage] = useState<boolean>(false);

  const [mirrored, setMirrored] = useState<boolean>(false);

  useEffect(() => {
    document.body.style.backgroundColor = backgroundColor;
  }, [backgroundColor]);

  // Handle key press event to toggle debugger visibility
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "d" || event.key === "D") {
        // 大文字小文字両方に対応
        setDebuggerVisibility((prev) => !prev);
      }

      if (event.key === "l" || event.key === "L") {
        // 大文字小文字両方に対応
        setAlign("left");
      }

      if (event.key === "r" || event.key === "R") {
        // 大文字小文字両方に対応
        setAlign("right");
      }

      if (event.key === "c" || event.key === "C") {
        // 大文字小文字両方に対応
        setAlign("center");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Show "Press d to show Debugger." message for 5 seconds after hiding the debugger
  useEffect(() => {
    if (!debuggerVisibility) {
      setShowMessage(true);
      const timeout = setTimeout(() => {
        setShowMessage(false);
      }, 2000); // 1秒間表示

      return () => clearTimeout(timeout); // クリーンアップ
    }
  }, [debuggerVisibility]);

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

        p5.translate(xOffset, yOffset);

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

        p5.push();
        p5.stroke(255, 0, 0);
        p5.strokeWeight(10);
        p5.noFill();
        p5.rect(0, 0, p5.width, p5.height);
        p5.pop();
      };
    },
    [thresholdRef, displayedPeopleRef, xOffset, yOffset]
  );

  return (
    <>
      {debuggerVisibility && (
        <div>
          {guideVisibility && (
            <div className="canvas-wrapper">
              <NextReactP5Wrapper
                sketch={sketch}
                canvasWidth={canvasSize.width}
                canvasHeight={canvasSize.height}
              />
            </div>
          )}

          <div
            className={`debugger-container ${align === "center" && "center"}
             ${align === "left" && "left"} ${align === "right" && "right"}`}
          >
            <div className="item-list">
              <div>
                <p className="headline">
                  Threshold: <span ref={thresholdTextRef} />
                </p>
              </div>
              <div>
                <p className="headline">
                  Frame Rate: <span ref={frameRateTextRef} />
                </p>
              </div>
              <div>
                <p className="headline">Camera Resolution: </p>
                {cameraResolution && (
                  <p>
                    {cameraResolution.width}x{cameraResolution.height}
                  </p>
                )}
              </div>
            </div>

            <div className="item-list">
              <div>
                <p className="headline">Background Color: </p>
                <ColorPalette setColor={setBackgroundColor} />
              </div>
              <div>
                <p className="headline">Text Color: </p>
                <ColorPalette setColor={setTextColor} />
              </div>
              <div>
                <p className="headline">Scale:</p>
                <input
                  type="number"
                  defaultValue={scale}
                  step={0.1}
                  onChange={(e) => {
                    setScale(Number(e.target.value));
                  }}
                />
              </div>
              <div>
                <p className="headline">X-offset:</p>
                <input
                  type="number"
                  defaultValue={xOffset}
                  onChange={(e) => {
                    setXOffset(Number(e.target.value));
                  }}
                />
              </div>
              <div>
                <p className="headline">Y-offset:</p>
                <input
                  type="number"
                  defaultValue={yOffset}
                  onChange={(e) => {
                    setYOffset(Number(e.target.value));
                  }}
                />
              </div>
              <div>
                <p className="headline">X-speed threshold:</p>
                <input
                  type="number"
                  defaultValue={xSpeedThreshold}
                  onChange={(e) => {
                    setXSpeedThreshold(Number(e.target.value));
                  }}
                />
              </div>
              <div>
                <p className="headline">Y-speed threshold:</p>
                <input
                  type="number"
                  defaultValue={ySpeedThreshold}
                  onChange={(e) => {
                    setYSpeedThreshold(Number(e.target.value));
                  }}
                />
              </div>
              <div>
                <p className="headline">canvas width:</p>
                <input
                  type="number"
                  defaultValue={canvasSize.width}
                  onChange={(e) => {
                    setCanvasSize({
                      width: Number(e.target.value),
                      height: canvasSize.height,
                    });
                  }}
                />
              </div>
              <div>
                <p className="headline">canvas height:</p>
                <input
                  type="number"
                  defaultValue={canvasSize.height}
                  onChange={(e) => {
                    setCanvasSize({
                      width: canvasSize.width,
                      height: Number(e.target.value),
                    });
                  }}
                />
              </div>
              <div>
                <p className="headline">server:</p>
                <input
                  type="text"
                  defaultValue={server}
                  onChange={(e) => {
                    setServer(String(e.target.value));
                  }}
                />
              </div>
            </div>

            <div className="item-list">
              <div
                className="toggle-list"
                onClick={() => {
                  setMirrored(!mirrored);
                }}
              >
                <p>Mirror Camera:</p>
                {mirrored ? (
                  <RadioOn
                    style={{ width: "1.5rem", height: "1.5rem", color: "gray" }}
                  />
                ) : (
                  <RadioOff
                    style={{ width: "1.5rem", height: "1.5rem", color: "gray" }}
                  />
                )}
              </div>
              <div
                className="toggle-list"
                onClick={() => {
                  setCameraVisibility(!cameraVisibility);
                }}
              >
                <p>Camera:</p>
                {cameraVisibility ? (
                  <VisibilityOn
                    style={{ width: "1.5rem", height: "1.5rem", color: "gray" }}
                  />
                ) : (
                  <VisibilityOff
                    style={{ width: "1.5rem", height: "1.5rem", color: "gray" }}
                  />
                )}
              </div>
              <div
                className="toggle-list"
                onClick={() => {
                  setGuideVisibility(!guideVisibility);
                }}
              >
                <p>Guide:</p>
                {guideVisibility ? (
                  <VisibilityOn
                    style={{ width: "1.5rem", height: "1.5rem", color: "gray" }}
                  />
                ) : (
                  <VisibilityOff
                    style={{ width: "1.5rem", height: "1.5rem", color: "gray" }}
                  />
                )}
              </div>
              <div
                className="toggle-list"
                onClick={() => {
                  setDebuggerVisibility(false);
                }}
              >
                <p>Debugger:</p>
                <VisibilityOn
                  style={{ width: "1.5rem", height: "1.5rem", color: "gray" }}
                />
              </div>
            </div>
          </div>
          {cameraVisibility && (
            <Monitor
              canvasSize={canvasSize}
              setCameraResolution={setCameraResolution}
              mirrored={mirrored}
              scale={scale}
              xOffset={xOffset}
              yOffset={yOffset}
            />
          )}

          <style jsx>{`
            .debugger-container {
              background-color: rgb(0 0 0 /0.3);
              padding: 30px;
              color: white;
              border-radius: 10px;
              display: flex;
              flex-flow: column;
              gap: 2rem;
              position: absolute;
              z-index: 99;

              &.left {
                top: 10px;
                left: 10px;
              }

              &.center {
                top: 10px;
                left: 40vw;
              }

              &.right {
                top: 10px;
                right: 10px;
              }
            }

            .headline {
              font-size: 0.9rem;
              margin-bottom: 0.2rem;
            }

            .item-list {
              display: flex;
              flex-flow: column;
              gap: 0.5rem;
            }
            .btn {
              width: 10rem;
              height: 2rem;
              border-radius: 1rem;
              border: none;
              color: white;
              background: #333;
              text-size: 1rem;
            }

            .toggle-list {
              font-size: 1rem;
              display: flex;
              width: 9rem;
              justify-content: space-between;
            }

            .canvas-wrapper {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              z-index: 90;
            }
          `}</style>
        </div>
      )}
      {/* Show message when debugger is hidden */}
      {!debuggerVisibility && (
        <>
          <div
            className={`message ${!showMessage ? "hide" : ""}`}
            ref={messageRef}
          >
            Press &quot;D&quot; to toggle Debugger.
          </div>
          <style jsx>{`
            .message {
              position: absolute;
              top: 10%;
              left: 50%;
              width: 300px;
              height: 3rem;
              background-color: #333;
              border-radius: 5px;
              transform: translate(-50%, -50%);
              text-align: center;
              line-height: 3rem;
              color: white;
              opacity: 0.8;
              transition: opacity 1s ease;
            }

            .hide {
              opacity: 0;
            }
          `}</style>
        </>
      )}
    </>
  );
};
