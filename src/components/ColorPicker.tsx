import React, { useState, useCallback, useRef } from 'react';
import Canvas from './Canvas';
import Magnifier from './Magnifier';

const ColorPicker: React.FC = () => {
  const [currentHexColor, setCurrentHexColor] = useState<string>('#FFFFFF');
  const [isDropperActive, setIsDropperActive] = useState<boolean>(false);
  const [dropperPosition, setDropperPosition] = useState<{ left: number; top: number }>({ left: 0, top: 0 });
  const [pickedPosition, setPickedPosition] = useState<{ x: number; y: number } | null>(null);
  const [previousColors, setPreviousColors] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDropperIconClick = useCallback(() => {
    setIsDropperActive(prevState => !prevState);
  }, []);

  const getHexColor = useCallback((data: Uint8ClampedArray) => {
    return `#${((1 << 24) + (data[0] << 16) + (data[1] << 8) + data[2]).toString(16).slice(1).toUpperCase()}`;
  }, []);

  const addPreviousColor = useCallback((color: string) => {
    setPreviousColors(prevColors => [...prevColors, color]);
  }, []);

  return (
    <div>
      <div id="canvas-container">
        <Canvas
          setCurrentHexColor={setCurrentHexColor}
          getHexColor={getHexColor}
          isDropperActive={isDropperActive}
          setDropperPosition={setDropperPosition}
          setPickedPosition={setPickedPosition}
          addPreviousColor={addPreviousColor}
          canvasRef={canvasRef}
        />
        <Magnifier
          currentHexColor={currentHexColor}
          dropperPosition={dropperPosition}
          isDropperActive={isDropperActive}
          canvasRef={canvasRef}
          pickedPosition={pickedPosition}
        />
        <h2 id="picked-color">Picked Color: {pickedPosition ? previousColors[previousColors.length - 1] : currentHexColor}</h2>
        <div id="previous-colors">
          {previousColors.map((color, index) => (
            <div key={index} style={{ backgroundColor: color, width: '50px', height: '50px', display: 'inline-block', margin: '5px' }}></div>
          ))}
        </div>
      </div>
      <img
        src="/img/IconColorPicker.svg"
        id="dropper-icon"
        alt="Dropper Icon"
        className="dropper-icon"
        onClick={handleDropperIconClick}
      />
    </div>
  );
};

export default ColorPicker;
