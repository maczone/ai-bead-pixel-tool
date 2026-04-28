// 颜色匹配引擎 - 将像素颜色与拼豆色库进行匹配

import { findNearestBeadColor, type BeadColor, type ColorLibrary } from './bead-colors';
import { clusterColors } from './pixel-converter';

export interface ColorMatchResult {
  // 原始像素数据（匹配后）
  matchedGrid: [number, number, number][];
  // 颜色映射：原始颜色 key -> 匹配后的拼豆颜色 hex
  colorMapping: Map<string, string>;
  // 使用的拼豆颜色列表
  usedBeadColors: { color: BeadColor; count: number }[];
  // 每个像素对应的拼豆颜色
  pixelColorIds: string[];
}

/**
 * 将像素数据与拼豆色库进行颜色匹配
 */
export function matchColorsToLibrary(
  grid: [number, number, number][],
  library: ColorLibrary,
  maxColors?: number
): ColorMatchResult {
  // 第一步：颜色聚类（如果设置了最大颜色数）
  let processedGrid = grid;
  let colorMap: Map<string, [number, number, number]> | null = null;

  if (maxColors && maxColors > 0) {
    colorMap = clusterColors(grid, maxColors);
    processedGrid = grid.map(([r, g, b]) => {
      const key = `${r},${g},${b}`;
      return colorMap!.get(key) || [r, g, b];
    });
  }

  // 第二步：将聚类后的颜色与色库匹配
  const colorMapping = new Map<string, string>();
  const usedColorMap = new Map<string, { color: BeadColor; count: number }>();
  const pixelColorIds: string[] = [];

  for (const [r, g, b] of processedGrid) {
    const originalKey = `${r},${g},${b}`;
    const nearest = findNearestBeadColor(r, g, b, library);
    const hex = nearest.hex;

    // 记录映射
    colorMapping.set(originalKey, hex);

    // 统计使用颜色
    const existing = usedColorMap.get(nearest.id);
    if (existing) {
      existing.count++;
    } else {
      usedColorMap.set(nearest.id, { color: nearest, count: 1 });
    }

    pixelColorIds.push(nearest.id);
  }

  // 排序：按使用量降序
  const usedBeadColors = Array.from(usedColorMap.values()).sort(
    (a, b) => b.count - a.count
  );

  return {
    matchedGrid: processedGrid,
    colorMapping,
    usedBeadColors,
    pixelColorIds,
  };
}

/**
 * 计算两种颜色的视觉距离
 */
export function colorDistance(
  c1: [number, number, number],
  c2: [number, number, number]
): number {
  const dr = c1[0] - c2[0];
  const dg = c1[1] - c2[1];
  const db = c1[2] - c2[2];
  return Math.sqrt(dr * dr * 2 + dg * dg * 4 + db * db * 3);
}

/**
 * 生成材料清单文本
 */
export function generateMaterialListText(
  usedBeadColors: { color: BeadColor; count: number }[],
  gridWidth: number,
  gridHeight: number,
  beadType: string,
  brand: string
): string {
  const totalBeads = usedBeadColors.reduce((sum, item) => sum + item.count, 0);
  const lines: string[] = [
    '╔══════════════════════════════════════════╗',
    '║        拼豆材料清单                       ║',
    '╚══════════════════════════════════════════╝',
    '',
    `色库品牌：${brand}`,
    `豆子规格：${beadType === 'standard' ? '标准豆 (5mm)' : '迷你豆 (2.6mm)'}`,
    `网格尺寸：${gridWidth} × ${gridHeight}`,
    `总用豆量：${totalBeads} 颗`,
    `使用颜色：${usedBeadColors.length} 种`,
    '',
    '┌────────┬──────────┬──────────┬────────┐',
    '│  色号  │  颜色名称  │  颜色    │  数量  │',
    '├────────┼──────────┼──────────┼────────┤',
  ];

  for (const item of usedBeadColors) {
    const { color, count } = item;
    const id = color.id.padEnd(6);
    const name = color.name.padEnd(8);
    const hex = color.hex.padEnd(8);
    const num = count.toString().padEnd(6);
    lines.push(`│ ${id} │ ${name} │ ${hex} │ ${num} │`);
  }

  lines.push('└────────┴──────────┴──────────┴────────┘');
  lines.push('');
  lines.push(`生成时间：${new Date().toLocaleString('zh-CN')}`);
  lines.push('—— AI智能拼豆像素化工具 ——');

  return lines.join('\n');
}
