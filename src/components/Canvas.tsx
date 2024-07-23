import React, { useEffect, useCallback } from 'react';

interface CanvasProps {
  getHexColor: (data: Uint8ClampedArray) => string;
  isDropperActive: boolean;
  setCurrentHexColor: (color: string) => void;
  setDropperPosition: (position: { left: number; top: number }) => void;
  canvasRef: any;
  setPickedPosition: (position: { x: number; y: number } | null) => void;
  addPreviousColor: (color: string) => void;
}

const Canvas: React.FC<CanvasProps> = ({ isDropperActive, getHexColor, setCurrentHexColor, setDropperPosition, setPickedPosition, addPreviousColor, canvasRef }) => {

  useEffect(() => {
    const canvas = canvasRef?.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const img = new Image();
    img.src = '/img/1920x1080-4598441-beach-water-pier-tropical-sky-sea-clouds-island-palm-trees.jpg'; // Update with the correct path
    img.onload = () => {
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  }, [canvasRef]);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!isDropperActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const pixel = context.getImageData(x, y, 1, 1).data;
    const hex = getHexColor(pixel);

    setCurrentHexColor(hex);
    setDropperPosition({ left: event.clientX - 50, top: event.clientY - 50 });
    setPickedPosition(null);
  }, [isDropperActive, getHexColor, canvasRef, setCurrentHexColor, setDropperPosition, setPickedPosition]);

  const handleClick = useCallback((event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!isDropperActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const pixel = context.getImageData(x, y, 1, 1).data;
    const hex = getHexColor(pixel);

    addPreviousColor(hex);
    setPickedPosition({ x, y });
  }, [isDropperActive, canvasRef, getHexColor, addPreviousColor, setPickedPosition]);

  return (
    <canvas
      ref={canvasRef}
      id="canvas"
      width="1000"
      height="1000"
      className="canvas"
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    />
  );
};

export default Canvas;
