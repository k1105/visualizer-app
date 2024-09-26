import { DisplayedPerson } from "@/types/DisplayedPersonClass";
import { MutableRefObject, useRef, useState, useEffect } from "react";
import { Monitor } from "./Monitor";
import { ColorPalette } from "./debugger/ColorPalette";
import { RadioOn } from "./icon/RadioOn";
import { RadioOff } from "./icon/RadioOff";
import Guide from "./debugger/Guide";
import ToggleVisibilityButton from "./debugger/ToggleVisibilityButton";
import ValueInputField from "./debugger/ValueInputField";
import XYInputField from "./debugger/XYInputField";
import { asekaku_240926, default_preset } from "@/public/data/Presets";

type Props = {
  thresholdRef: MutableRefObject<number>;
  displayedPeopleRef: MutableRefObject<DisplayedPerson[]>;
  setTextColor: (color: string) => void;
  scale: number;
  translate: { x: number; y: number };
  offset: { x: number; y: number };
  canvasSize: { width: number; height: number };
  server: string;
  speedThreshold: { x: number; y: number };
  debuggerVisibility: boolean;
  setTranslate: (val: { x: number; y: number }) => void;
  setScale: (scale: number) => void;
  setOffset: (val: { x: number; y: number }) => void;
  setServer: (server: string) => void;
  setSpeedThreshold: (val: { x: number; y: number }) => void;
  setCanvasSize: (size: { width: number; height: number }) => void;
  setDebuggerVisibility: (debuggerVisibility: boolean) => void;
};

export const Debugger = ({
  debuggerVisibility,
  setDebuggerVisibility,
  thresholdRef,
  displayedPeopleRef,
  scale,
  translate,
  offset,
  server,
  canvasSize,
  speedThreshold,
  setTextColor,
  setScale,
  setTranslate,
  setOffset,
  setServer,
  setSpeedThreshold,
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
  const [showMessage, setShowMessage] = useState<boolean>(false);

  const [mirrored, setMirrored] = useState<boolean>(false);

  const presets = [asekaku_240926, default_preset];
  const [presetName, setPresetName] = useState<string>(presets[0].name);

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const presetName = e.target.value;
    const selectedPreset = presets.find((p) => p.name === presetName);
    if (selectedPreset) {
      setPresetName(selectedPreset.name);
      setOffset(selectedPreset.offset);
      setScale(selectedPreset.scale);
      setCanvasSize(selectedPreset.canvasSize);
      setServer(selectedPreset.server);
      setSpeedThreshold(selectedPreset.speedThreshold);
      if (selectedPreset.translate) {
        setTranslate(selectedPreset.translate);
      }
    }
  };

  useEffect(() => {
    document.body.style.backgroundColor = backgroundColor;
  }, [backgroundColor]);

  // Handle key press event to toggle debugger visibility
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "d" || event.key === "D") {
        // 大文字小文字両方に対応
        setDebuggerVisibility(!debuggerVisibility);
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
  }, [debuggerVisibility, setDebuggerVisibility]);

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

  return (
    <>
      {debuggerVisibility && (
        <div>
          <Guide
            frameRateTextRef={frameRateTextRef}
            thresholdTextRef={thresholdTextRef}
            thresholdRef={thresholdRef}
            offset={offset}
            displayedPeopleRef={displayedPeopleRef}
            canvasSize={canvasSize}
          />

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
              <ValueInputField
                propertyName="Scale"
                value={scale}
                setValue={setScale}
              />
              <XYInputField
                propertyName="Translate"
                value={translate}
                setValue={setTranslate}
              />
              <XYInputField
                propertyName="Offset"
                value={offset}
                setValue={setOffset}
              />
              <XYInputField
                propertyName="Speed Threshold"
                value={speedThreshold}
                setValue={setSpeedThreshold}
              />
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
              <div>
                <p className="headline">Preset</p>
                <select
                  id="presetSelector"
                  value={presetName}
                  onChange={handlePresetChange}
                >
                  {presets.map((preset) => (
                    <option key={preset.name} value={preset.name}>
                      {preset.name}
                    </option>
                  ))}
                </select>
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
              <ToggleVisibilityButton
                propertyName="Camera"
                visibility={cameraVisibility}
                setVisibility={setCameraVisibility}
              />
              <ToggleVisibilityButton
                propertyName="Guide"
                visibility={guideVisibility}
                setVisibility={setGuideVisibility}
              />
              <ToggleVisibilityButton
                propertyName="Debugger"
                visibility={debuggerVisibility}
                setVisibility={setDebuggerVisibility}
              />
            </div>
          </div>
          {cameraVisibility && (
            <Monitor
              canvasSize={canvasSize}
              setCameraResolution={setCameraResolution}
              mirrored={mirrored}
              scale={scale}
              offset={offset}
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
