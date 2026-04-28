'use client';

import { useMemo } from 'react';
import { useBeadStore } from '@/store/bead-store';
import { ClipboardList, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

export function MaterialList() {
  const { colorMatchResult, gridWidth, gridHeight, beadType, colorLibraryBrand, exportMaterialList } = useBeadStore();
  const [expanded, setExpanded] = useState(true);

  const totalBeads = useMemo(() => {
    if (!colorMatchResult) return 0;
    return colorMatchResult.usedBeadColors.reduce((sum, item) => sum + item.count, 0);
  }, [colorMatchResult]);

  if (!colorMatchResult) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground/50">
        <p className="text-xs">完成配色匹配后显示材料清单</p>
      </div>
    );
  }

  const beadTypeName = beadType === 'standard' ? '标准豆 (5mm)' : '迷你豆 (2.6mm)';

  return (
    <div className="space-y-3">
      {/* 标题栏 */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
          <ClipboardList className="h-3.5 w-3.5" />
          材料清单
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-6 px-2 text-xs gap-1"
            onClick={exportMaterialList}
          >
            <Download className="h-3 w-3" />
            下载
          </Button>
        </div>
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-md border bg-muted/20 px-3 py-2">
          <p className="text-xs text-muted-foreground">总用豆量</p>
          <p className="text-lg font-semibold tabular-nums">{totalBeads.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">颗</p>
        </div>
        <div className="rounded-md border bg-muted/20 px-3 py-2">
          <p className="text-xs text-muted-foreground">使用颜色</p>
          <p className="text-lg font-semibold tabular-nums">{colorMatchResult.usedBeadColors.length}</p>
          <p className="text-xs text-muted-foreground">种</p>
        </div>
      </div>

      {/* 参数信息 */}
      <div className="flex flex-wrap gap-1.5">
        <Badge variant="outline" className="text-xs">{gridWidth}×{gridHeight}</Badge>
        <Badge variant="outline" className="text-xs">{colorLibraryBrand}</Badge>
        <Badge variant="outline" className="text-xs">{beadTypeName}</Badge>
      </div>

      {/* 颜色详细列表 */}
      {expanded && (
        <div className="max-h-64 overflow-y-auto rounded-md border">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-background">
              <tr className="border-b text-muted-foreground">
                <th className="py-2 px-2 text-left font-medium w-8">色</th>
                <th className="py-2 px-2 text-left font-medium">色号</th>
                <th className="py-2 px-2 text-left font-medium">名称</th>
                <th className="py-2 px-2 text-left font-medium">HEX</th>
                <th className="py-2 px-2 text-right font-medium">数量</th>
                <th className="py-2 px-2 text-right font-medium w-16">占比</th>
              </tr>
            </thead>
            <tbody>
              {colorMatchResult.usedBeadColors.map((item, index) => {
                const percentage = ((item.count / totalBeads) * 100).toFixed(1);
                return (
                  <tr key={item.color.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-1.5 px-2">
                      <div
                        className="w-5 h-5 rounded-sm border border-black/10"
                        style={{ backgroundColor: item.color.hex }}
                        title={item.color.hex}
                      />
                    </td>
                    <td className="py-1.5 px-2 font-mono tabular-nums">{item.color.id}</td>
                    <td className="py-1.5 px-2">{item.color.name}</td>
                    <td className="py-1.5 px-2 font-mono text-muted-foreground">{item.color.hex}</td>
                    <td className="py-1.5 px-2 text-right tabular-nums font-medium">{item.count}</td>
                    <td className="py-1.5 px-2 text-right tabular-nums text-muted-foreground">
                      {percentage}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
