'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { useBeadStore } from '@/store/bead-store';
import { PIXEL_SIZE } from '@/lib/pixel-converter';
import { Loader2, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function PatternCanvas() {
  const {
    originalImage,
    originalPixelData,
    colorMatchResult,
    isColorMatched,
    activeTab,
    editorTool,
    showGrid,
    beadType,
    isProcessing,
    selectedBeadColor,
    paintPixel,
    erasePixel,
    pickColor,
  } = useBeadStore();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hoverCell, setHoverCell] = useState<{ x: number; y: number } | null>(null);
  const lastDrawnCell = useRef<string | null>(null);

  // 计算像素显示大小
  const basePixelSize = isColorMatched ? PIXEL_SIZE[beadType] : PIXEL_SIZE[beadType];

  // 渲染 Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 原图预览
    if (activeTab === 'original' && originalImage) {
      const maxW = containerRef.current?.clientWidth || 600;
      const maxH = containerRef.current?.clientHeight || 500;
      const imgW = originalImage.naturalWidth || originalImage.width;
      const imgH = originalImage.naturalHeight || originalImage.height;
      const scale = Math.min(maxW / imgW, maxH / imgH, 1);
      const w = Math.round(imgW * scale);
      const h = Math.round(imgH * scale);

      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(originalImage, 0, 0, w, h);
      }
      return;
    }

    // 像素图预览
    if (originalPixelData) {
      const { width, height } = originalPixelData;
      const pixelSize = Math.max(basePixelSize, 5);
      const cw = width * pixelSize;
      const ch = height * pixelSize;

      canvas.width = cw;
      canvas.height = ch;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.imageSmoothingEnabled = false;

      const { grid } = originalPixelData;

      // 绘制像素格子
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = y * width + x;
          let [r, g, b] = grid[idx];

          // 如果颜色已匹配
          if (isColorMatched && colorMatchResult) {
            const key = `${r},${g},${b}`;
            const matchedHex = colorMatchResult.colorMapping.get(key);
            if (matchedHex) {
              r = parseInt(matchedHex.slice(1, 3), 16);
              g = parseInt(matchedHex.slice(3, 5), 16);
              b = parseInt(matchedHex.slice(5, 7), 16);
            }
          }

          ctx.fillStyle = `rgb(${r},${g},${b})`;
          ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
      }

      // 网格线
      if (showGrid && pixelSize >= 5) {
        ctx.strokeStyle = 'rgba(128,128,128,0.25)';
        ctx.lineWidth = 0.5;
        for (let x = 0; x <= width; x++) {
          ctx.beginPath();
          ctx.moveTo(x * pixelSize + 0.5, 0);
          ctx.lineTo(x * pixelSize + 0.5, ch);
          ctx.stroke();
        }
        for (let y = 0; y <= height; y++) {
          ctx.beginPath();
          ctx.moveTo(0, y * pixelSize + 0.5);
          ctx.lineTo(cw, y * pixelSize + 0.5);
          ctx.stroke();
        }
      }

      // 悬停高亮
      if (hoverCell) {
        ctx.strokeStyle = 'rgba(255, 50, 50, 0.8)';
        ctx.lineWidth = 2;
        ctx.strokeRect(
          hoverCell.x * pixelSize + 1,
          hoverCell.y * pixelSize + 1,
          pixelSize - 2,
          pixelSize - 2
        );

        // 绘制选中颜色预览（画笔模式）
        if (editorTool === 'paint' && selectedBeadColor) {
          ctx.fillStyle = selectedBeadColor.hex;
          ctx.globalAlpha = 0.5;
          ctx.fillRect(hoverCell.x * pixelSize, hoverCell.y * pixelSize, pixelSize, pixelSize);
          ctx.globalAlpha = 1.0;
        }
      }
    }
  }, [originalImage, originalPixelData, colorMatchResult, isColorMatched, activeTab, showGrid, beadType, basePixelSize, hoverCell, editorTool, selectedBeadColor]);

  // 鼠标坐标转网格坐标
  const getGridCoord = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !originalPixelData) return null;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const pixelSize = Math.max(basePixelSize, 5);

    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    const gridX = Math.floor(mouseX / pixelSize);
    const gridY = Math.floor(mouseY / pixelSize);

    if (gridX < 0 || gridX >= originalPixelData.width || gridY < 0 || gridY >= originalPixelData.height) {
      return null;
    }

    return { x: gridX, y: gridY };
  }, [originalPixelData, basePixelSize]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTab === 'original' || !originalPixelData) return;

    const coord = getGridCoord(e);
    setHoverCell(coord);

    if (isDrawing && coord) {
      const cellKey = `${coord.x},${coord.y}`;
      if (cellKey === lastDrawnCell.current) return;
      lastDrawnCell.current = cellKey;

      if (editorTool === 'paint') {
        paintPixel(coord.x, coord.y);
      } else if (editorTool === 'eraser') {
        erasePixel(coord.x, coord.y);
      }
    }
  }, [activeTab, originalPixelData, getGridCoord, isDrawing, editorTool, paintPixel, erasePixel]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTab === 'original' || !originalPixelData) return;

    const coord = getGridCoord(e);
    if (!coord) return;

    if (editorTool === 'picker') {
      pickColor(coord.x, coord.y);
      return;
    }

    setIsDrawing(true);
    lastDrawnCell.current = null;

    if (editorTool === 'paint') {
      paintPixel(coord.x, coord.y);
    } else if (editorTool === 'eraser') {
      erasePixel(coord.x, coord.y);
    }
  }, [activeTab, originalPixelData, getGridCoord, editorTool, paintPixel, erasePixel, pickColor]);

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
    lastDrawnCell.current = null;
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoverCell(null);
    setIsDrawing(false);
    lastDrawnCell.current = null;
  }, []);

  const zoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const resetZoom = () => setZoom(1);

  return (
    <div className="flex flex-col h-full">
      {/* 工具提示 */}
      {activeTab !== 'original' && originalPixelData && (
        <div className="flex items-center gap-2 mb-2">
          {editorTool === 'paint' && (
            <Badge variant="secondary" className="text-xs">
              <PaintbrushIcon /> 画笔模式 - 点击或拖拽绘制
            </Badge>
          )}
          {editorTool === 'eraser' && (
            <Badge variant="secondary" className="text-xs">
              <EraserIcon /> 橡皮擦模式 - 点击或拖拽擦除
            </Badge>
          )}
          {editorTool === 'picker' && (
            <Badge variant="secondary" className="text-xs">
              <PickerIcon /> 取色器 - 点击像素选取颜色
            </Badge>
          )}
          {hoverCell && (
            <span className="text-xs text-muted-foreground ml-auto">
              ({hoverCell.x}, {hoverCell.y})
            </span>
          )}
        </div>
      )}

      {/* Canvas 区域 */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center bg-muted/20 rounded-lg border overflow-auto relative min-h-[300px]"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {isProcessing && (
          <div className="absolute inset-0 bg-background/70 flex items-center justify-center z-10 rounded-lg">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">处理中...</span>
            </div>
          </div>
        )}

        {!originalImage && (
          <div className="flex flex-col items-center justify-center text-muted-foreground/50 py-20">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm">请先上传图片</p>
            <p className="text-xs mt-1">支持 JPG / PNG / WebP 格式</p>
          </div>
        )}

        {activeTab === 'original' && originalImage && (
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-full object-contain"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
          />
        )}

        {(activeTab === 'pixel' || activeTab === 'matched') && originalPixelData && (
          <canvas
            ref={canvasRef}
            className="cursor-crosshair"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'center center',
              imageRendering: 'pixelated',
            }}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
          />
        )}
      </div>

      {/* 缩放控制 */}
      {originalImage && (
        <div className="flex items-center justify-center gap-2 mt-2">
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={zoomOut}>
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <span className="text-xs tabular-nums w-12 text-center text-muted-foreground">
            {Math.round(zoom * 100)}%
          </span>
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={zoomIn}>
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={resetZoom}>
            <Maximize2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}

// Small inline icons for badges
function PaintbrushIcon() {
  return <svg className="h-3 w-3 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>;
}
function EraserIcon() {
  return <svg className="h-3 w-3 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
}
function PickerIcon() {
  return <svg className="h-3 w-3 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>;
}
