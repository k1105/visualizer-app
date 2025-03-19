import {useRef, useState, useEffect} from "react";
import {ColorPalette} from "./debugger/ColorPalette";
import {RadioOn} from "./icon/RadioOn";
import {RadioOff} from "./icon/RadioOff";
import Guide from "./debugger/Guide";
import ToggleVisibilityButton from "./debugger/ToggleVisibilityButton";
import ValueInputField from "./debugger/ValueInputField";
import XYInputField from "./debugger/XYInputField";
import {asekaku_241005, default_preset} from "@/public/data/Presets";
import classes from "@/styles/components/Debugger.module.css";
import WidthHeightInputField from "./debugger/WidthHeightInputField";
import MinMaxInputField from "./debugger/MinMaxInputField";
import {useProperty} from "./context/PropertyContext";

export const Debugger = () => {
  const {
    scale,
    setScale,
    offset,
    setOffset,
    translate,
    setTranslate,
    canvasSize,
    setCanvasSize,
    cameraVisibility,
    setCameraVisibility,
    mirrored,
    setMirrored,
    cameraResolution,
    debuggerVisibility,
    setDebuggerVisibility,
    setTextColor,
    areaRange,
    setAreaRange,
    server,
    setServer,
  } = useProperty();
  const frameRateTextRef = useRef<HTMLParagraphElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>("black");

  const [align, setAlign] = useState<string>("left");
  const [guideVisibility, setGuideVisibility] = useState<boolean>(true);
  const [showMessage, setShowMessage] = useState<boolean>(false);

  const presets = [default_preset, asekaku_241005];
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
          <Guide frameRateTextRef={frameRateTextRef} canvasSize={canvasSize} />

          <div
            className={`debugger-container ${align === "center" && "center"}
             ${align === "left" && "left"} ${align === "right" && "right"}`}
          >
            <div className="item-list">
              <div>
                <p className={classes.headline}>
                  Frame Rate: <span ref={frameRateTextRef} />
                </p>
              </div>
              <div>
                <p className={classes.headline}>Camera Resolution: </p>
                {cameraResolution && (
                  <p>
                    {cameraResolution.width}x{cameraResolution.height}
                  </p>
                )}
              </div>
            </div>

            <div className="item-list">
              <div>
                <p className={classes.headline}>Background Color: </p>
                <ColorPalette setColor={setBackgroundColor} />
              </div>
              <div>
                <p className={classes.headline}>Text Color: </p>
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
              <WidthHeightInputField
                propertyName="Canvas Size"
                value={canvasSize}
                setValue={setCanvasSize}
              />
              <MinMaxInputField
                propertyName="Area Range"
                value={areaRange}
                setValue={setAreaRange}
              />
              <div>
                <p className={classes.headline}>server:</p>
                <input
                  type="text"
                  defaultValue={server}
                  onChange={(e) => {
                    setServer(String(e.target.value));
                  }}
                />
              </div>
              <div>
                <p className={classes.headline}>Preset</p>
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
                    style={{width: "1.5rem", height: "1.5rem", color: "gray"}}
                  />
                ) : (
                  <RadioOff
                    style={{width: "1.5rem", height: "1.5rem", color: "gray"}}
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

          <style jsx>{`
            .debugger-container {
              max-height: 100vh;
              overflow-y: scroll;
              background-color: rgb(0 0 0 /0.3);
              padding: 30px;
              color: white;
              display: flex;
              flex-flow: column;
              gap: 2rem;
              position: fixed;
              z-index: 99;

              &.left {
                top: 0;
                left: 10px;
              }

              &.center {
                top: 0;
                left: 40vw;
              }

              &.right {
                top: 0;
                right: 10px;
              }
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
