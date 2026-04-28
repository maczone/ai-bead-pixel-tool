// 像素转换引擎 - 将图像转换为像素网格

export interface PixelData {
  // 二维数组，每个元素是 [r, g, b]
  grid: [number, number, number][];
  width: number;
  height: number;
}

export type BeadType = 'standard' | 'mini';

// 像素显示大小配置
export const PIXEL_SIZE: Record<BeadType, number> = {
  standard: 10, // 大豆 10px/格
  mini: 5,      // 小豆 5px/格
};

/**
 * 将 Image 对象转换为指定网格尺寸的像素数据
 * 采用 "缩小-采样-放大" 的经典像素化方法
 */
export function imageToPixelData(
  image: HTMLImageElement,
  gridWidth: number,
  gridHeight: number
): PixelData {
  // 创建临时 Canvas，缩小到目标网格尺寸
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = gridWidth;
  tempCanvas.height = gridHeight;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) throw new Error('无法创建 Canvas 上下文');

  // 使用 imageSmoothingEnabled = false 保持像素锐利
  tempCtx.imageSmoothingEnabled = true;
  tempCtx.imageSmoothingQuality = 'medium';

  // 计算裁剪区域（居中裁剪为正方形或指定比例）
  const srcWidth = image.naturalWidth || image.width;
  const srcHeight = image.naturalHeight || image.height;
  const srcRatio = srcWidth / srcHeight;
  const dstRatio = gridWidth / gridHeight;

  let sx = 0, sy = 0, sw = srcWidth, sh = srcHeight;

  if (srcRatio > dstRatio) {
    // 原图更宽，裁剪左右
    sw = srcHeight * dstRatio;
    sx = (srcWidth - sw) / 2;
  } else {
    // 原图更高，裁剪上下
    sh = srcWidth / dstRatio;
    sy = (srcHeight - sh) / 2;
  }

  // 将原图绘制到临时 Canvas（自动缩放+采样）
  tempCtx.drawImage(image, sx, sy, sw, sh, 0, 0, gridWidth, gridHeight);

  // 提取像素数据
  const imageData = tempCtx.getImageData(0, 0, gridWidth, gridHeight);
  const pixels = imageData.data;

  const grid: [number, number, number][] = [];
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      const idx = (y * gridWidth + x) * 4;
      grid.push([pixels[idx], pixels[idx + 1], pixels[idx + 2]]);
    }
  }

  return { grid, width: gridWidth, height: gridHeight };
}

/**
 * 将像素数据渲染到 Canvas 上
 */
export function renderPixelGrid(
  canvas: HTMLCanvasElement,
  pixelData: PixelData,
  options: {
    showGrid?: boolean;
    pixelSize?: number;
    highlightCell?: { x: number; y: number } | null;
    matchedColors?: Map<string, string>; // key: "r,g,b", value: bead color hex
  } = {}
) {
  const {
    showGrid = true,
    pixelSize = 10,
    highlightCell = null,
    matchedColors,
  } = options;

  const { width, height, grid } = pixelData;
  const canvasWidth = width * pixelSize;
  const canvasHeight = height * pixelSize;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('无法创建 Canvas 上下文');

  ctx.imageSmoothingEnabled = false;

  // 绘制每个像素格子
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      let [r, g, b] = grid[idx];

      // 如果有颜色匹配，使用匹配后的颜色
      if (matchedColors) {
        const key = `${r},${g},${b}`;
        const matchedHex = matchedColors.get(key);
        if (matchedHex) {
          const mr = parseInt(matchedHex.slice(1, 3), 16);
          const mg = parseInt(matchedHex.slice(3, 5), 16);
          const mb = parseInt(matchedHex.slice(5, 7), 16);
          r = mr; g = mg; b = mb;
        }
      }

      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);

      // 高亮当前单元格
      if (highlightCell && highlightCell.x === x && highlightCell.y === y) {
        ctx.strokeStyle = '#ff4444';
        ctx.lineWidth = 2;
        ctx.strokeRect(
          x * pixelSize + 1,
          y * pixelSize + 1,
          pixelSize - 2,
          pixelSize - 2
        );
      }
    }
  }

  // 绘制网格线
  if (showGrid && pixelSize >= 5) {
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 0.5;
    // 垂直线
    for (let x = 0; x <= width; x++) {
      ctx.beginPath();
      ctx.moveTo(x * pixelSize, 0);
      ctx.lineTo(x * pixelSize, canvasHeight);
      ctx.stroke();
    }
    // 水平线
    for (let y = 0; y <= height; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * pixelSize);
      ctx.lineTo(canvasWidth, y * pixelSize);
      ctx.stroke();
    }
  }
}

/**
 * 简化版 K-Means 颜色聚类算法
 * 将颜色数限制到指定数量
 */
export function clusterColors(
  grid: [number, number, number][],
  maxColors: number
): Map<string, [number, number, number]> {
  // 统计唯一颜色
  const colorCount = new Map<string, { rgb: [number, number, number]; count: number }>();
  for (const [r, g, b] of grid) {
    const key = `${r},${g},${b}`;
    const existing = colorCount.get(key);
    if (existing) {
      existing.count++;
    } else {
      colorCount.set(key, { rgb: [r, g, b], count: 1 });
    }
  }

  const uniqueColors = Array.from(colorCount.values());

  // 如果颜色数已经不超过限制，直接返回
  if (uniqueColors.length <= maxColors) {
    const result = new Map<string, [number, number, number]>();
    for (const { rgb } of uniqueColors) {
      result.set(`${rgb[0]},${rgb[1]},${rgb[2]}`, rgb);
    }
    return result;
  }

  // 简化 K-Means：按频率排序，取前 maxColors 个高频颜色作为初始中心
  uniqueColors.sort((a, b) => b.count - a.count);

  // 使用前N个高频颜色作为聚类中心
  const centers: [number, number, number][] = uniqueColors
    .slice(0, maxColors)
    .map(c => [...c.rgb] as [number, number, number]);

  // 迭代聚类（简化为3次迭代）
  for (let iter = 0; iter < 3; iter++) {
    // 分配每个颜色到最近的中心
    const clusters: [number, number, number][][] = centers.map(() => []);

    for (const { rgb } of uniqueColors) {
      let minDist = Infinity;
      let bestCenter = 0;
      for (let i = 0; i < centers.length; i++) {
        const dr = rgb[0] - centers[i][0];
        const dg = rgb[1] - centers[i][1];
        const db = rgb[2] - centers[i][2];
        const dist = dr * dr + dg * dg + db * db;
        if (dist < minDist) {
          minDist = dist;
          bestCenter = i;
        }
      }
      clusters[bestCenter].push(rgb);
    }

    // 更新中心
    for (let i = 0; i < centers.length; i++) {
      if (clusters[i].length === 0) continue;
      let sr = 0, sg = 0, sb = 0;
      for (const [r, g, b] of clusters[i]) {
        sr += r; sg += g; sb += b;
      }
      const n = clusters[i].length;
      centers[i] = [Math.round(sr / n), Math.round(sg / n), Math.round(sb / n)];
    }
  }

  // 建立原始颜色到最近聚类中心的映射
  const colorMap = new Map<string, [number, number, number]>();
  for (const { rgb } of uniqueColors) {
    let minDist = Infinity;
    let bestCenter: [number, number, number] = centers[0];
    for (const center of centers) {
      const dr = rgb[0] - center[0];
      const dg = rgb[1] - center[1];
      const db = rgb[2] - center[2];
      const dist = dr * dr + dg * dg + db * db;
      if (dist < minDist) {
        minDist = dist;
        bestCenter = center;
      }
    }
    colorMap.set(`${rgb[0]},${rgb[1]},${rgb[2]}`, bestCenter);
  }

  return colorMap;
}
