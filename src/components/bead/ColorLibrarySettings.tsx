'use client';

import { Palette } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBeadStore } from '@/store/bead-store';
import { colorLibraries } from '@/lib/bead-colors';
import { Separator } from '@/components/ui/separator';

export function ColorLibrarySettings() {
  const { colorLibraryBrand, maxColors, setColorLibraryBrand, setMaxColors } = useBeadStore();

  const library = colorLibraries[colorLibraryBrand];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
        <Palette className="h-3.5 w-3.5" />
        色库设置
      </h3>

      {/* 品牌选择 */}
      <div className="space-y-2">
        <Label className="text-xs">色库品牌</Label>
        <Select value={colorLibraryBrand} onValueChange={setColorLibraryBrand}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.values(colorLibraries).map(lib => (
              <SelectItem key={lib.brand} value={lib.brand}>
                <span className="flex items-center justify-between w-full gap-4">
                  <span>{lib.brand}</span>
                  <span className="text-xs text-muted-foreground">{lib.totalColors} 色</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">{library?.description}</p>
      </div>

      {/* 色库预览 */}
      <div className="flex flex-wrap gap-0.5 rounded-md border p-1.5 bg-muted/30">
        {library?.colors.map(color => (
          <div
            key={color.id}
            className="w-4 h-4 rounded-sm border border-black/10 hover:scale-125 transition-transform cursor-default"
            style={{ backgroundColor: color.hex }}
            title={`${color.id} ${color.name} ${color.hex}`}
          />
        ))}
      </div>

      <Separator />

      {/* 最大颜色数 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs">最大颜色数</Label>
          <span className="text-xs font-medium tabular-nums bg-muted px-1.5 py-0.5 rounded">
            {maxColors} 色
          </span>
        </div>
        <Slider
          value={[maxColors]}
          onValueChange={([val]) => setMaxColors(val)}
          min={4}
          max={library?.totalColors || 72}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground/60">
          <span>4</span>
          <span>{library?.totalColors || 72}</span>
        </div>
      </div>
    </div>
  );
}
