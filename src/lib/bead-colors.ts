// MARD 72色拼豆色库数据
// 包含色号、颜色名称、RGB值

export interface BeadColor {
  id: string;
  name: string;
  rgb: [number, number, number];
  hex: string;
}

export interface ColorLibrary {
  brand: string;
  description: string;
  totalColors: number;
  colors: BeadColor[];
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

// MARD 72色标准拼豆色库
const mardColors: BeadColor[] = [
  // 白色系
  { id: 'M01', name: '白色', rgb: [255, 255, 255], hex: '#ffffff' },
  { id: 'M02', name: '米白色', rgb: [255, 250, 240], hex: '#fffaf0' },
  { id: 'M03', name: '奶黄色', rgb: [255, 248, 220], hex: '#fff8dc' },

  // 灰色系
  { id: 'M04', name: '浅灰色', rgb: [211, 211, 211], hex: '#d3d3d3' },
  { id: 'M05', name: '银灰色', rgb: [192, 192, 192], hex: '#c0c0c0' },
  { id: 'M06', name: '中灰色', rgb: [150, 150, 150], hex: '#969696' },
  { id: 'M07', name: '深灰色', rgb: [105, 105, 105], hex: '#696969' },
  { id: 'M08', name: '炭灰色', rgb: [64, 64, 64], hex: '#404040' },
  { id: 'M09', name: '黑色', rgb: [0, 0, 0], hex: '#000000' },

  // 红色系
  { id: 'M10', name: '浅粉色', rgb: [255, 182, 193], hex: '#ffb6c1' },
  { id: 'M11', name: '粉红色', rgb: [255, 105, 180], hex: '#ff69b4' },
  { id: 'M12', name: '玫瑰红', rgb: [220, 20, 60], hex: '#dc143c' },
  { id: 'M13', name: '樱桃红', rgb: [255, 0, 50], hex: '#ff0032' },
  { id: 'M14', name: '正红色', rgb: [220, 0, 0], hex: '#dc0000' },
  { id: 'M15', name: '深红色', rgb: [139, 0, 0], hex: '#8b0000' },
  { id: 'M16', name: '酒红色', rgb: [128, 0, 32], hex: '#800020' },

  // 橙色系
  { id: 'M17', name: '桃粉色', rgb: [255, 183, 130], hex: '#ffb782' },
  { id: 'M18', name: '浅橙色', rgb: [255, 160, 100], hex: '#ffa064' },
  { id: 'M19', name: '橙色', rgb: [255, 140, 0], hex: '#ff8c00' },
  { id: 'M20', name: '深橙色', rgb: [230, 100, 0], hex: '#e66400' },

  // 黄色系
  { id: 'M21', name: '柠檬黄', rgb: [255, 255, 100], hex: '#ffff64' },
  { id: 'M22', name: '浅黄色', rgb: [255, 255, 150], hex: '#ffff96' },
  { id: 'M23', name: '明黄色', rgb: [255, 230, 0], hex: '#ffe600' },
  { id: 'M24', name: '金黄色', rgb: [255, 200, 0], hex: '#ffc800' },
  { id: 'M25', name: '土黄色', rgb: [200, 160, 40], hex: '#c8a028' },
  { id: 'M26', name: '深黄色', rgb: [180, 140, 20], hex: '#b48c14' },

  // 绿色系
  { id: 'M27', name: '浅绿色', rgb: [144, 238, 144], hex: '#90ee90' },
  { id: 'M28', name: '嫩绿色', rgb: [120, 220, 80], hex: '#78dc50' },
  { id: 'M29', name: '草绿色', rgb: [80, 200, 50], hex: '#50c832' },
  { id: 'M30', name: '翠绿色', rgb: [0, 180, 0], hex: '#00b400' },
  { id: 'M31', name: '深绿色', rgb: [0, 128, 0], hex: '#008000' },
  { id: 'M32', name: '墨绿色', rgb: [0, 80, 40], hex: '#005028' },
  { id: 'M33', name: '薄荷绿', rgb: [150, 230, 200], hex: '#96e6c8' },
  { id: 'M34', name: '橄榄绿', rgb: [107, 142, 35], hex: '#6b8e23' },

  // 蓝色系
  { id: 'M35', name: '天蓝色', rgb: [135, 206, 250], hex: '#87cefa' },
  { id: 'M36', name: '浅蓝色', rgb: [100, 180, 255], hex: '#64b4ff' },
  { id: 'M37', name: '湖蓝色', rgb: [60, 150, 220], hex: '#3c96dc' },
  { id: 'M38', name: '宝蓝色', rgb: [30, 120, 200], hex: '#1e78c8' },
  { id: 'M39', name: '深蓝色', rgb: [0, 70, 150], hex: '#004696' },
  { id: 'M40', name: '藏青色', rgb: [0, 0, 128], hex: '#000080' },
  { id: 'M41', name: '深藏青', rgb: [15, 15, 80], hex: '#0f0f50' },

  // 紫色系
  { id: 'M42', name: '淡紫色', rgb: [200, 180, 255], hex: '#c8b4ff' },
  { id: 'M43', name: '薰衣草紫', rgb: [180, 150, 230], hex: '#b496e6' },
  { id: 'M44', name: '紫色', rgb: [148, 103, 189], hex: '#9467bd' },
  { id: 'M45', name: '深紫色', rgb: [100, 50, 150], hex: '#643296' },
  { id: 'M46', name: '蓝紫色', rgb: [90, 60, 160], hex: '#5a3ca0' },
  { id: 'M47', name: '深紫红', rgb: [128, 0, 100], hex: '#800064' },

  // 棕色系
  { id: 'M48', name: '浅肤色', rgb: [255, 224, 189], hex: '#ffe0bd' },
  { id: 'M49', name: '肤色', rgb: [240, 200, 160], hex: '#f0c8a0' },
  { id: 'M50', name: '浅棕色', rgb: [210, 170, 120], hex: '#d2aa78' },
  { id: 'M51', name: '棕色', rgb: [180, 120, 60], hex: '#b4783c' },
  { id: 'M52', name: '深棕色', rgb: [139, 90, 43], hex: '#8b5a2b' },
  { id: 'M53', name: '巧克力色', rgb: [100, 60, 30], hex: '#643c1e' },
  { id: 'M54', name: '咖啡色', rgb: [80, 45, 20], hex: '#502d14' },

  // 青色系
  { id: 'M55', name: '浅青色', rgb: [150, 230, 230], hex: '#96e6e6' },
  { id: 'M56', name: '青色', rgb: [0, 200, 200], hex: '#00c8c8' },
  { id: 'M57', name: '深青色', rgb: [0, 140, 140], hex: '#008c8c' },
  { id: 'M58', name: '湖绿色', rgb: [0, 180, 180], hex: '#00b4b4' },

  // 珊瑚色系
  { id: 'M59', name: '珊瑚色', rgb: [255, 127, 80], hex: '#ff7f50' },
  { id: 'M60', name: '鲑鱼色', rgb: [250, 128, 114], hex: '#fa8072' },
  { id: 'M61', name: '暗珊瑚', rgb: [205, 91, 69], hex: '#cd5b45' },

  // 粉色系
  { id: 'M62', name: '浅桃色', rgb: [255, 218, 185], hex: '#ffadb9' },
  { id: 'M63', name: '紫粉色', rgb: [200, 100, 150], hex: '#c86496' },
  { id: 'M64', name: '品红色', rgb: [220, 50, 150], hex: '#dc3296' },

  // 特殊色
  { id: 'M65', name: '透明色', rgb: [230, 240, 255], hex: '#e6f0ff' },
  { id: 'M66', name: '夜光绿', rgb: [150, 255, 150], hex: '#96ff96' },
  { id: 'M67', name: '荧光黄', rgb: [255, 255, 50], hex: '#ffff32' },
  { id: 'M68', name: '荧光粉', rgb: [255, 100, 200], hex: '#ff64c8' },
  { id: 'M69', name: '荧光橙', rgb: [255, 150, 50], hex: '#ff9632' },
  { id: 'M70', name: '荧光蓝', rgb: [50, 200, 255], hex: '#32c8ff' },
  { id: 'M71', name: '荧光绿', rgb: [50, 255, 100], hex: '#32ff64' },
  { id: 'M72', name: '渐变紫', rgb: [160, 80, 180], hex: '#a050b4' },
];

// Hama 24色迷你豆色库
const hamaColors: BeadColor[] = [
  { id: 'H01', name: '白色', rgb: [255, 255, 255], hex: '#ffffff' },
  { id: 'H02', name: '浅黄', rgb: [255, 255, 150], hex: '#ffff96' },
  { id: 'H03', name: '明黄', rgb: [255, 230, 0], hex: '#ffe600' },
  { id: 'H04', name: '橙色', rgb: [255, 140, 0], hex: '#ff8c00' },
  { id: 'H05', name: '红色', rgb: [220, 0, 0], hex: '#dc0000' },
  { id: 'H06', name: '粉红', rgb: [255, 105, 180], hex: '#ff69b4' },
  { id: 'H07', name: '浅紫', rgb: [200, 180, 255], hex: '#c8b4ff' },
  { id: 'H08', name: '紫色', rgb: [148, 103, 189], hex: '#9467bd' },
  { id: 'H09', name: '深蓝', rgb: [0, 70, 150], hex: '#004696' },
  { id: 'H10', name: '天蓝', rgb: [100, 180, 255], hex: '#64b4ff' },
  { id: 'H11', name: '浅青', rgb: [150, 230, 230], hex: '#96e6e6' },
  { id: 'H12', name: '青色', rgb: [0, 200, 200], hex: '#00c8c8' },
  { id: 'H13', name: '浅绿', rgb: [144, 238, 144], hex: '#90ee90' },
  { id: 'H14', name: '草绿', rgb: [80, 200, 50], hex: '#50c832' },
  { id: 'H15', name: '深绿', rgb: [0, 128, 0], hex: '#008000' },
  { id: 'H16', name: '薄荷绿', rgb: [150, 230, 200], hex: '#96e6c8' },
  { id: 'H17', name: '浅灰', rgb: [211, 211, 211], hex: '#d3d3d3' },
  { id: 'H18', name: '中灰', rgb: [150, 150, 150], hex: '#969696' },
  { id: 'H19', name: '深灰', rgb: [105, 105, 105], hex: '#696969' },
  { id: 'H20', name: '黑色', rgb: [0, 0, 0], hex: '#000000' },
  { id: 'H21', name: '肤色', rgb: [240, 200, 160], hex: '#f0c8a0' },
  { id: 'H22', name: '浅棕', rgb: [210, 170, 120], hex: '#d2aa78' },
  { id: 'H23', name: '棕色', rgb: [180, 120, 60], hex: '#b4783c' },
  { id: 'H24', name: '深棕', rgb: [100, 60, 30], hex: '#643c1e' },
];

export const colorLibraries: Record<string, ColorLibrary> = {
  MARD: {
    brand: 'MARD',
    description: 'MARD 72色标准拼豆色库',
    totalColors: 72,
    colors: mardColors,
  },
  HAMA: {
    brand: 'Hama',
    description: 'Hama 24色迷你豆色库',
    totalColors: 24,
    colors: hamaColors,
  },
};

export function getColorLibrary(brand: string): ColorLibrary {
  return colorLibraries[brand] || colorLibraries.MARD;
}

export function findNearestBeadColor(
  r: number,
  g: number,
  b: number,
  library: ColorLibrary
): BeadColor {
  let minDist = Infinity;
  let nearest: BeadColor = library.colors[0];

  for (const color of library.colors) {
    const dr = r - color.rgb[0];
    const dg = g - color.rgb[1];
    const db = b - color.rgb[2];
    // 加权欧氏距离 (人眼对绿色更敏感)
    const dist = dr * dr * 2 + dg * dg * 4 + db * db * 3;
    if (dist < minDist) {
      minDist = dist;
      nearest = color;
    }
  }

  return nearest;
}

export type { BeadColor, ColorLibrary };
