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

type Props = {
  thresholdRef: MutableRefObject<number>;
  displayedPeopleRef: MutableRefObject<DisplayedPerson[]>;
  setTextColor: (color: string) => void;
  scale: number;
  xOffset: number;
  yOffset: number;
  setScale: (scale: number) => void;
  setXOffset: (offset: number) => void;
  setYOffset: (offset: number) => void;
  setXSpeedThreshold: (threshold: number) => void;
  setYSpeedThreshold: (threshold: number) => void;
  xSpeedThreshold: number;
  ySpeedThreshold: number;
};

export const Debugger = ({
  thresholdRef,
  displayedPeopleRef,
  scale,
  xOffset,
  yOffset,
  setTextColor,
  setScale,
  setXOffset,
  setYOffset,
  xSpeedThreshold,
  ySpeedThreshold,
  setXSpeedThreshold,
  setYSpeedThreshold,
}: Props) => {
  const thresholdTextRef = useRef<HTMLParagraphElement>(null);
  const frameRateTextRef = useRef<HTMLParagraphElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>("black");
  const [cameraResolution, setCameraResolution] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const [monitorVisiblity, setMonitorVisiblity] = useState<boolean>(true);
  const [guideVisiblity, setGuideVisiblity] = useState<boolean>(true);
  const [debuggerVisiblity, setDebuggerVisiblity] = useState<boolean>(true);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [innerWidth, setInnerWidth] = useState<number>(0);
  const [innerHeight, setInnerHeight] = useState<number>(0);

  useEffect(() => {
    setInnerWidth(window.innerWidth);
    setInnerHeight(window.innerHeight);
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = backgroundColor;
  }, [backgroundColor]);

  // Handle key press event to toggle debugger visibility
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "d" || event.key === "D") {
        // 大文字小文字両方に対応
        setDebuggerVisiblity((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Show "Press d to show Debugger." message for 5 seconds after hiding the debugger
  useEffect(() => {
    if (!debuggerVisiblity) {
      setShowMessage(true);
      const timeout = setTimeout(() => {
        setShowMessage(false);
      }, 2000); // 1秒間表示

      return () => clearTimeout(timeout); // クリーンアップ
    }
  }, [debuggerVisiblity]);

  const sketch = useCallback(
    (p5: P5CanvasInstance) => {
      p5.setup = () => {
        p5.createCanvas(innerWidth, innerHeight);
        p5.fill(255);
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
          p5.push();
          p5.textAlign(p5.LEFT);
          p5.translate(20, 50);
          p5.textSize(20);
          p5.text("id: " + person.id, box[0], box[1]);
          p5.translate(0, 30);
          p5.text(
            "speed-x: " + Math.floor(person.speed.x * 100) / 100,
            box[0],
            box[1]
          );
          p5.translate(0, 30);
          p5.text(
            "speed-y: " + Math.floor(person.speed.y * 100) / 100,
            box[0],
            box[1]
          );
          p5.pop();

          p5.push();
          p5.noFill();
          p5.stroke(0, 255, 0);
          p5.circle(bboxCenter.x, bboxCenter.y, thresholdRef.current * 2);
          p5.stroke(255, 0, 0);
          p5.rect(box[0], box[1], box[2] - box[0], box[3] - box[1]);
          p5.pop();
        }
      };
    },
    [
      thresholdRef,
      displayedPeopleRef,
      xOffset,
      yOffset,
      innerWidth,
      innerHeight,
    ]
  );

  return (
    <>
      {debuggerVisiblity && (
        <div>
          {guideVisiblity && (
            <div style={{ position: "absolute", top: 0, left: 0, zIndex: 90 }}>
              <NextReactP5Wrapper sketch={sketch} />
            </div>
          )}

          <div
            className="debugger-container"
            style={{ position: "absolute", top: 0, left: 0, zIndex: 99 }}
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
            </div>

            <div className="item-list">
              <div
                className="toggle-list"
                onClick={() => {
                  setMonitorVisiblity(!monitorVisiblity);
                }}
              >
                <p>Monitor:</p>
                {monitorVisiblity ? (
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
                  setGuideVisiblity(!guideVisiblity);
                }}
              >
                <p>Guide:</p>
                {guideVisiblity ? (
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
                  setDebuggerVisiblity(false);
                }}
              >
                <p>Debugger:</p>
                <VisibilityOn
                  style={{ width: "1.5rem", height: "1.5rem", color: "gray" }}
                />
              </div>
            </div>
          </div>
          {monitorVisiblity && (
            <Monitor
              setCameraResolution={setCameraResolution}
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
              margin-left: 10px;
              margin-top: 10px;
              display: flex;
              flex-flow: column;
              gap: 2rem;
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
          `}</style>
        </div>
      )}
      {/* Show message when debugger is hidden */}
      {!debuggerVisiblity && (
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
