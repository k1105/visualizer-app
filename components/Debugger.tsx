import {useRef, useState, useEffect} from "react";
import {ColorPalette} from "./debugger/ColorPalette";
import {RadioOn} from "./icon/RadioOn";
import {RadioOff} from "./icon/RadioOff";
import Guide from "./debugger/Guide";
import ToggleVisibilityButton from "./debugger/ToggleVisibilityButton";
import ValueInputField from "./debugger/ValueInputField";
import XYInputField from "./debugger/XYInputField";
import {acc_250322, default_preset} from "@/public/data/Presets";
import WidthHeightInputField from "./debugger/WidthHeightInputField";
import MinMaxInputField from "./debugger/MinMaxInputField";
import {useProperty} from "./context/PropertyContext";
import {useCameraProperty} from "./context/CameraPropertyContext";
import styles from "@/styles/components/Debugger.module.scss";

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
    debuggerVisibility,
    setDebuggerVisibility,
    setTextColor,
    areaRange,
    setAreaRange,
    server,
    setServer,
    rotationActive,
    setRotationActive,
    lastCharacterVisibility,
    setLastCharacterVisibility,
    bboxVisibility,
    setBboxVisibility,
  } = useProperty();

  const {
    cameraResolution,
    mirrored,
    setMirrored,
    cameraVisibility,
    setCameraVisibility,
  } = useCameraProperty();
  const frameRateTextRef = useRef<HTMLParagraphElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>("black");

  const [align, setAlign] = useState<string>("left");
  const [guideVisibility, setGuideVisibility] = useState<boolean>(true);
  const [showMessage, setShowMessage] = useState<boolean>(false);

  const presets = [default_preset, acc_250322];
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
            className={`${styles.debuggerContainer} ${
              align === "center" && styles.center
            }
             ${align === "left" && styles.left} ${
              align === "right" && styles.right
            }`}
          >
            <div className={styles.itemList}>
              <div>
                <p className={styles.headline}>
                  Frame Rate: <span ref={frameRateTextRef} />
                </p>
              </div>
              <div>
                <p className={styles.headline}>Camera Resolution: </p>
                {cameraResolution && (
                  <p>
                    {cameraResolution.width}x{cameraResolution.height}
                  </p>
                )}
              </div>
            </div>

            <div className={styles.itemList}>
              <div>
                <p className={styles.headline}>Background Color: </p>
                <ColorPalette setColor={setBackgroundColor} />
              </div>
              <div>
                <p className={styles.headline}>Text Color: </p>
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
                min={0}
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
                <p className={styles.headline}>server:</p>
                <input
                  type="text"
                  defaultValue={server}
                  onChange={(e) => {
                    setServer(String(e.target.value));
                  }}
                />
              </div>
              <div>
                <p className={styles.headline}>Preset</p>
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

            <div className={styles.itemList}>
              <div
                className={styles.toggleList}
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
              <ToggleVisibilityButton
                propertyName="Rotaiton"
                visibility={rotationActive}
                setVisibility={setRotationActive}
              />
              <ToggleVisibilityButton
                propertyName="LastCharacter"
                visibility={lastCharacterVisibility}
                setVisibility={setLastCharacterVisibility}
              />
              <ToggleVisibilityButton
                propertyName="Bbox"
                visibility={bboxVisibility}
                setVisibility={setBboxVisibility}
              />
            </div>
          </div>
        </div>
      )}
      {/* Show message when debugger is hidden */}
      {!debuggerVisibility && (
        <>
          <div
            className={`${styles.message} ${!showMessage ? styles.hide : ""}`}
            ref={messageRef}
          >
            Press &quot;D&quot; to toggle Debugger.
          </div>
        </>
      )}
    </>
  );
};
