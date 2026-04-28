'use client';

import { Grid3X3, Ruler } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { useBeadStore, type BeadType } from '@/store/bead-store';
import { Separator } from '@/components/ui/separator';

const GRID_PRESETS = [
  { label: '16 × 16', width: 16, height: 16, desc: '简单图案' },
  { label: '24 × 24', width: 24, height: 24, desc: '小图案' },
  { label: '32 × 32', width: 32, height: 32, desc: '中图案' },
  { label: '48 × 48', width: 48, height: 48, desc: '大图案' },
  { label: '64 × 64', width: 64, height: 64, desc: '精细图案' },
];

export function GridSettings() {
  const { gridWidth, gridHeight, beadType, setGridWidth, setGridHeight, setBeadType } = useBeadStore();

  const currentPreset = GRID_PRESETS.find(p => p.width === gridWidth && p.height === gridHeight);

  const handlePresetChange = (value: string) => {
    const preset = GRID_PRESETS.find(p => p.label === value);
    if (preset) {
      setGridWidth(preset.width);
      setGridHeight(preset.height);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
        <Grid3X3 className="h-3.5 w-3.5" />
        网格设置
      </h3>

      {/* 预设选择 */}
      <div className="space-y-2">
        <Label className="text-xs">网格尺寸</Label>
        <Select value={currentPreset?.label || ''} onValueChange={handlePresetChange}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="选择网格尺寸" />
          </SelectTrigger>
          <SelectContent>
            {GRID_PRESETS.map(preset => (
              <SelectItem key={preset.label} value={preset.label}>
                <span className="flex items-center justify-between w-full gap-4">
                  <span>{preset.label}</span>
                  <span className="text-xs text-muted-foreground">{preset.desc}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          当前: {gridWidth} × {gridHeight} = {gridWidth * gridHeight} 格
        </p>
      </div>

      <Separator />

      {/* 豆子规格 */}
      <div className="space-y-2">
        <Label className="text-xs flex items-center gap-1.5">
          <Ruler className="h-3 w-3" />
          拼豆规格
        </Label>
        <RadioGroup
          value={beadType}
          onValueChange={(val) => setBeadType(val as BeadType)}
          className="flex gap-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="standard" id="standard" />
            <Label htmlFor="standard" className="text-xs font-normal cursor-pointer">
              标准豆 (5mm)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mini" id="mini" />
            <Label htmlFor="mini" className="text-xs font-normal cursor-pointer">
              迷你豆 (2.6mm)
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
