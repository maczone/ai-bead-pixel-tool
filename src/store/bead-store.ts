import { create } from 'zustand';
import { type PixelData, type BeadType, PIXEL_SIZE, imageToPixelData } from '@/lib/pixel-converter';
import { getColorLibrary, findNearestBeadColor, type BeadColor } from '@/lib/bead-colors';
import { matchColorsToLibrary, type ColorMatchResult, generateMaterialListText } from '@/lib/color-matcher';

export type EditorTool = 'paint' | 'eraser' | 'picker';

interface BeadStore {
  // 原始图片
  originalImage: HTMLImageElement | null;
  imagePreviewUrl: string | null;
  imageFileName: string | null;

  // 设置参数
  gridWidth: number;
  gridHeight: number;
  beadType: BeadType;
  colorLibraryBrand: string;
  maxColors: number;

  // 像素数据
  originalPixelData: PixelData | null;
  colorMatchResult: ColorMatchResult | null;
  isColorMatched: boolean;

  // 编辑器状态
  editorTool: EditorTool;
  selectedBeadColor: BeadColor | null;
  showGrid: boolean;
  isProcessing: boolean;

  // 视图状态
  activeTab: 'original' | 'pixel' | 'matched';

  // Actions
  setImage: (file: File) => Promise<void>;
  setGridWidth: (width: number) => void;
  setGridHeight: (height: number) => void;
  setBeadType: (type: BeadType) => void;
  setColorLibraryBrand: (brand: string) => void;
  setMaxColors: (max: number) => void;
  setEditorTool: (tool: EditorTool) => void;
  setSelectedBeadColor: (color: BeadColor | null) => void;
  setShowGrid: (show: boolean) => void;
  setActiveTab: (tab: 'original' | 'pixel' | 'matched') => void;

  // 核心操作
  generatePixelPreview: () => void;
  applyColorMatching: () => void;
  paintPixel: (gridX: number, gridY: number) => void;
  erasePixel: (gridX: number, gridY: number) => void;
  pickColor: (gridX: number, gridY: number) => void;

  // 导出
  exportPNG: () => void;
  exportMaterialList: () => void;
}

export const useBeadStore = create<BeadStore>((set, get) => ({
  originalImage: null,
  imagePreviewUrl: null,
  imageFileName: null,
  gridWidth: 32,
  gridHeight: 32,
  beadType: 'standard',
  colorLibraryBrand: 'MARD',
  maxColors: 24,
  originalPixelData: null,
  colorMatchResult: null,
  isColorMatched: false,
  editorTool: 'paint',
  selectedBeadColor: null,
  showGrid: true,
  isProcessing: false,
  activeTab: 'original',

  setImage: async (file: File) => {
    // 验证文件类型
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      throw new Error('请上传 JPG、PNG 或 WebP 格式的图片');
    }
    // 验证文件大小
    if (file.size > 20 * 1024 * 1024) {
      throw new Error('图片大小不能超过 20MB');
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          set({
            originalImage: img,
            imagePreviewUrl: dataUrl,
            imageFileName: file.name,
            originalPixelData: null,
            colorMatchResult: null,
            isColorMatched: false,
            activeTab: 'original',
          });
          resolve();
        };
        img.onerror = () => reject(new Error('图片加载失败'));
        img.src = dataUrl;
      };
      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsDataURL(file);
    });
  },

  setGridWidth: (width) => set({ gridWidth: width }),
  setGridHeight: (height) => set({ gridHeight: height }),
  setBeadType: (type) => set({ beadType: type }),
  setColorLibraryBrand: (brand) => set({ colorLibraryBrand: brand }),
  setMaxColors: (max) => set({ maxColors: max }),
  setEditorTool: (tool) => set({ editorTool: tool }),
  setSelectedBeadColor: (color) => set({ selectedBeadColor: color }),
  setShowGrid: (show) => set({ showGrid: show }),
  setActiveTab: (tab) => set({ activeTab: tab }),

  generatePixelPreview: () => {
    const { originalImage, gridWidth, gridHeight } = get();
    if (!originalImage) return;

    set({ isProcessing: true });
    try {
      const pixelData = imageToPixelData(originalImage, gridWidth, gridHeight);
      set({
        originalPixelData: pixelData,
        colorMatchResult: null,
        isColorMatched: false,
        activeTab: 'pixel',
      });
    } finally {
      set({ isProcessing: false });
    }
  },

  applyColorMatching: () => {
    const { originalPixelData, colorLibraryBrand, maxColors } = get();
    if (!originalPixelData) return;

    set({ isProcessing: true });
    try {
      const library = getColorLibrary(colorLibraryBrand);
      const result = matchColorsToLibrary(
        originalPixelData.grid,
        library,
        maxColors
      );
      set({
        colorMatchResult: result,
        isColorMatched: true,
        activeTab: 'matched',
      });
    } finally {
      set({ isProcessing: false });
    }
  },

  paintPixel: (gridX: number, gridY: number) => {
    const { originalPixelData, colorMatchResult, selectedBeadColor, isColorMatched, colorLibraryBrand } = get();
    if (!selectedBeadColor || !originalPixelData) return;

    const { width, grid } = originalPixelData;
    if (gridX < 0 || gridX >= width || gridY < 0 || gridY >= originalPixelData.height) return;

    const idx = gridY * width + gridX;
    grid[idx] = [...selectedBeadColor.rgb] as [number, number, number];

    // 如果已经匹配过颜色，重新匹配
    if (isColorMatched) {
      const library = getColorLibrary(colorLibraryBrand);
      const maxColors = get().maxColors;
      const result = matchColorsToLibrary(grid, library, maxColors);
      set({ colorMatchResult: result });
    }
  },

  erasePixel: (gridX: number, gridY: number) => {
    const { originalPixelData, isColorMatched, colorLibraryBrand } = get();
    if (!originalPixelData) return;

    const { width, grid } = originalPixelData;
    if (gridX < 0 || gridX >= width || gridY < 0 || gridY >= originalPixelData.height) return;

    const idx = gridY * width + gridX;
    grid[idx] = [255, 255, 255]; // 白色（空白）

    if (isColorMatched) {
      const library = getColorLibrary(colorLibraryBrand);
      const maxColors = get().maxColors;
      const result = matchColorsToLibrary(grid, library, maxColors);
      set({ colorMatchResult: result });
    }
  },

  pickColor: (gridX: number, gridY: number) => {
    const { originalPixelData, colorLibraryBrand } = get();
    if (!originalPixelData) return;

    const { width, grid } = originalPixelData;
    if (gridX < 0 || gridX >= width || gridY < 0 || gridY >= originalPixelData.height) return;

    const idx = gridY * width + gridX;
    const [r, g, b] = grid[idx];
    const library = getColorLibrary(colorLibraryBrand);
    const nearest = library.colors.find(
      c => c.rgb[0] === r && c.rgb[1] === g && c.rgb[2] === b
    ) || findNearestBeadColor(r, g, b, library);

    set({ selectedBeadColor: nearest, editorTool: 'paint' });
  },

  exportPNG: () => {
    const { originalPixelData, colorMatchResult, isColorMatched, showGrid, beadType, colorLibraryBrand, maxColors } = get();
    if (!originalPixelData) return;

    const pixelSize = isColorMatched ? PIXEL_SIZE[beadType] * 2 : PIXEL_SIZE[beadType] * 2;

    // 创建导出用的 Canvas
    const exportCanvas = document.createElement('canvas');
    const { width, height, grid } = originalPixelData;
    exportCanvas.width = width * pixelSize + 1;
    exportCanvas.height = height * pixelSize + 1;

    const ctx = exportCanvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;

    // 白色背景
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    // 绘制像素格子
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        let [r, g, b] = grid[idx];

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
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= width; x++) {
      ctx.beginPath();
      ctx.moveTo(x * pixelSize, 0);
      ctx.lineTo(x * pixelSize, height * pixelSize);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * pixelSize);
      ctx.lineTo(width * pixelSize, y * pixelSize);
      ctx.stroke();
    }

    // 添加色板信息
    if (isColorMatched && colorMatchResult) {
      const infoHeight = 80 + colorMatchResult.usedBeadColors.length * 24;
      const fullCanvas = document.createElement('canvas');
      fullCanvas.width = exportCanvas.width;
      fullCanvas.height = exportCanvas.height + infoHeight;
      const fullCtx = fullCanvas.getContext('2d')!;

      fullCtx.fillStyle = '#ffffff';
      fullCtx.fillRect(0, 0, fullCanvas.width, fullCanvas.height);
      fullCtx.drawImage(exportCanvas, 0, 0);

      // 标题
      fullCtx.fillStyle = '#333333';
      fullCtx.font = 'bold 14px sans-serif';
      fullCtx.fillText(`拼豆图纸 (${width}×${height}) - ${colorLibraryBrand} ${beadType === 'standard' ? '标准豆' : '迷你豆'}`, 10, exportCanvas.height + 24);

      // 色板信息
      fullCtx.font = '12px sans-serif';
      let offsetY = exportCanvas.height + 48;
      for (let i = 0; i < colorMatchResult.usedBeadColors.length; i++) {
        const item = colorMatchResult.usedBeadColors[i];
        const col = i % 4;
        const row = Math.floor(i / 4);
        const x = 10 + col * (exportCanvas.width / 4);
        const y = offsetY + row * 24;

        // 色块
        fullCtx.fillStyle = item.color.hex;
        fullCtx.fillRect(x, y - 10, 12, 12);
        fullCtx.strokeStyle = '#ccc';
        fullCtx.strokeRect(x, y - 10, 12, 12);

        // 文字
        fullCtx.fillStyle = '#333';
        fullCtx.fillText(`${item.color.id} ${item.color.name} ×${item.count}`, x + 16, y);
      }

      // 下载
      const link = document.createElement('a');
      link.download = `拼豆图纸_${width}x${height}_${colorLibraryBrand}.png`;
      link.href = fullCanvas.toDataURL('image/png');
      link.click();
    } else {
      const link = document.createElement('a');
      link.download = `像素图_${width}x${height}.png`;
      link.href = exportCanvas.toDataURL('image/png');
      link.click();
    }
  },

  exportMaterialList: () => {
    const { colorMatchResult, gridWidth, gridHeight, beadType, colorLibraryBrand, maxColors } = get();
    if (!colorMatchResult) return;

    const text = generateMaterialListText(
      colorMatchResult.usedBeadColors,
      gridWidth,
      gridHeight,
      beadType,
      colorLibraryBrand
    );

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.download = `材料清单_${gridWidth}x${height}_${colorLibraryBrand}.txt`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  },
}));
