'use client';

import { Paintbrush, Eraser, Pipette, Grid3X3, Grid3x3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useBeadStore, type EditorTool } from '@/store/bead-store';
import { getColorLibrary } from '@/lib/bead-colors';
import { useCallback, useState } from 'react';

export function EditorToolbar() {
  const {
    editorTool,
    setEditorTool,
    showGrid,
    setShowGrid,
    selectedBeadColor,
    setSelectedBeadColor,
    colorLibraryBrand,
    originalPixelData,
    colorMatchResult,
    isColorMatched,
  } = useBeadStore();

  const [showColorPicker, setShowColorPicker] = useState(false);

  const library = getColorLibrary(colorLibraryBrand);
  const hasPixelData = !!originalPixelData;

  const tools: { value: EditorTool; icon: React.ReactNode; label: string }[] = [
    { value: 'paint', icon: <Paintbrush className="h-4 w-4" />, label: '画笔' },
    { value: 'eraser', icon: <Eraser className="h-4 w-4" />, label: '橡皮擦' },
    { value: 'picker', icon: <Pipette className="h-4 w-4" />, label: '取色器' },
  ];

  // 当前可用的颜色（如果已匹配，使用匹配后的颜色；否则使用色库全色）
  const availableColors = isColorMatched && colorMatchResult
    ? colorMatchResult.usedBeadColors.map(item => item.color)
    : library.colors;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
        <Paintbrush className="h-3.5 w-3.5" />
        编辑工具
      </h3>

      {/* 工具切换 */}
      <ToggleGroup
        type="single"
        value={editorTool}
        onValueChange={(val) => val && setEditorTool(val as EditorTool)}
        className="justify-start"
      >
        {tools.map(tool => (
          <ToggleGroupItem
            key={tool.value}
            value={tool.value}
            aria-label={tool.label}
            className="text-xs gap-1.5 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            disabled={!hasPixelData}
          >
            {tool.icon}
            <span className="hidden sm:inline">{tool.label}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {/* 当前选中颜色 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs">画笔颜色</Label>
          {selectedBeadColor && (
            <span className="text-xs text-muted-foreground">
              {selectedBeadColor.id} {selectedBeadColor.name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="w-8 h-8 rounded-md border-2 border-border hover:border-primary transition-colors relative overflow-hidden"
            disabled={!hasPixelData}
          >
            {selectedBeadColor ? (
              <div
                className="w-full h-full rounded-sm"
                style={{ backgroundColor: selectedBeadColor.hex }}
              />
            ) : (
              <div className="w-full h-full bg-muted-foreground/20" />
            )}
          </button>
          <span className="text-xs text-muted-foreground">
            {selectedBeadColor ? selectedBeadColor.hex : '未选择'}
          </span>
        </div>

        {/* 颜色选择面板 */}
        {showColorPicker && (
          <div className="border rounded-lg p-2 bg-muted/20 max-h-48 overflow-y-auto">
            <div className="flex flex-wrap gap-1">
              {availableColors.map(color => (
                <button
                  key={color.id}
                  onClick={() => {
                    setSelectedBeadColor(color);
                    setEditorTool('paint');
                  }}
                  className={`w-6 h-6 rounded border-2 transition-all hover:scale-110 ${
                    selectedBeadColor?.id === color.id
                      ? 'border-primary ring-1 ring-primary/30 scale-110'
                      : 'border-black/10'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={`${color.id} ${color.name}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* 网格线切换 */}
      <div className="flex items-center justify-between">
        <Label htmlFor="grid-toggle" className="text-xs flex items-center gap-1.5">
          {showGrid ? <Grid3X3 className="h-3.5 w-3.5" /> : <Grid3x3 className="h-3.5 w-3.5" />}
          显示网格线
        </Label>
        <Switch
          id="grid-toggle"
          checked={showGrid}
          onCheckedChange={setShowGrid}
        />
      </div>
    </div>
  );
}
