import React, { useRef, useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import Canvas from 'react-native-canvas';

interface SortingCanvasProps {
  array: number[];
  highlightIndices?: number[];
  isDragging?: boolean;
  draggedIndex?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CANVAS_HEIGHT = 300;
const PADDING = 10;

export const SortingCanvas: React.FC<SortingCanvasProps> = ({
  array,
  highlightIndices = [],
  isDragging = false,
  draggedIndex = -1,
}) => {
  const canvasRef = useRef<Canvas | null>(null);

  const drawArray = (canvas: Canvas) => {
    const ctx = canvas.getContext('2d');
    const maxValue = Math.max(...array);
    const barWidth = (SCREEN_WIDTH - 2 * PADDING) / array.length;
    const scaleFactor = (CANVAS_HEIGHT - 40) / maxValue;

    // Clear canvas
    ctx.clearRect(0, 0, SCREEN_WIDTH, CANVAS_HEIGHT);

    // Draw bars
    array.forEach((value, index) => {
      const barHeight = value * scaleFactor;
      const x = index * barWidth + PADDING;
      const y = CANVAS_HEIGHT - barHeight - 20;

      // Set bar color
      if (highlightIndices.includes(index)) {
        ctx.fillStyle = '#ff4444'; // Highlight color
      } else if (index === draggedIndex) {
        ctx.fillStyle = '#4CAF50'; // Dragged bar color
      } else {
        ctx.fillStyle = '#02a9f7'; // Default color
      }

      // Draw bar with shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.fillRect(x, y, barWidth - 2, barHeight);

      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Draw value
      ctx.fillStyle = '#000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(value.toString(), x + barWidth / 2, y - 5);
    });
  };

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = SCREEN_WIDTH;
      canvas.height = CANVAS_HEIGHT;
      drawArray(canvas);
    }
  }, [array, highlightIndices, isDragging, draggedIndex]);

  return (
    <View style={{ height: CANVAS_HEIGHT, width: SCREEN_WIDTH }}>
      <Canvas ref={canvasRef} />
    </View>
  );
};