import React, { useEffect, useRef, useCallback } from 'react';

interface MagnifierProps {
  currentHexColor: string;
  dropperPosition: { left: number; top: number };
  isDropperActive: boolean;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  pickedPosition: { x: number; y: number } | null;
}

const Magnifier: React.FC<MagnifierProps> = ({ currentHexColor, dropperPosition, isDropperActive, canvasRef, pickedPosition }) => {
  const magnifierRef = useRef<HTMLCanvasElement>(null);

  const drawMagnifier = useCallback((event: MouseEvent) => {
    if (!isDropperActive || !canvasRef.current || !magnifierRef.current || pickedPosition) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const magnifierContext = magnifierRef.current.getContext('2d');

    if (!context || !magnifierContext) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const zoomFactor = 5;

    magnifierContext.clearRect(0, 0, magnifierRef.current.width, magnifierRef.current.height);
    magnifierContext.drawImage(
      canvas,
      x - (magnifierRef.current.width / 2 / zoomFactor),
      y - (magnifierRef.current.height / 2 / zoomFactor),
      magnifierRef.current.width / zoomFactor,
      magnifierRef.current.height / zoomFactor,
      0,
      0,
      magnifierRef.current.width,
      magnifierRef.current.height
    );
  }, [isDropperActive, canvasRef, pickedPosition]);

  useEffect(() => {
    document.addEventListener('mousemove', drawMagnifier);
    return () => {
      document.removeEventListener('mousemove', drawMagnifier);
    };
  }, [drawMagnifier]);

  return (
    <div
      id="dropper"
      className="dropper"
      style={{
        position: 'absolute',
        left: dropperPosition.left,
        top: dropperPosition.top,
        borderColor: currentHexColor,
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        overflow: 'hidden',
        borderWidth: '5px',
        borderStyle: 'solid',
      }}
    >
      <canvas
        id="magnifier"
        ref={magnifierRef}
        width="100"
        height="100"
        className="magnifier"
      />
    </div>
  );
};

export default Magnifier;
