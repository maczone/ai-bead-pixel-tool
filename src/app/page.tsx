'use client';

import { useCallback } from 'react';
import { useBeadStore } from '@/store/bead-store';
import { ImageUploader } from '@/components/bead/ImageUploader';
import { GridSettings } from '@/components/bead/GridSettings';
import { ColorLibrarySettings } from '@/components/bead/ColorLibrarySettings';
import { EditorToolbar } from '@/components/bead/EditorToolbar';
import { PatternCanvas } from '@/components/bead/PatternCanvas';
import { MaterialList } from '@/components/bead/MaterialList';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  Download,
  FileText,
  Image as ImageIcon,
  Grid3X3,
  Palette,
  Loader2,
  Settings,
  Undo2,
  Layers,
} from 'lucide-react';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function Home() {
  const {
    originalImage,
    originalPixelData,
    colorMatchResult,
    isColorMatched,
    activeTab,
    setActiveTab,
    gridWidth,
    gridHeight,
    isProcessing,
    generatePixelPreview,
    applyColorMatching,
    exportPNG,
    exportMaterialList,
  } = useBeadStore();

  const handleGeneratePreview = useCallback(() => {
    if (!originalImage) {
      toast.error('请先上传图片');
      return;
    }
    try {
      generatePixelPreview();
      toast.success('像素化预览已生成');
    } catch {
      toast.error('生成预览失败，请重试');
    }
  }, [originalImage, generatePixelPreview]);

  const handleColorMatch = useCallback(() => {
    if (!originalPixelData) {
      toast.error('请先生成像素预览');
      return;
    }
    try {
      applyColorMatching();
      toast.success('配色匹配完成');
    } catch {
      toast.error('配色匹配失败，请重试');
    }
  }, [originalPixelData, applyColorMatching]);

  const handleExportPNG = useCallback(() => {
    if (!originalPixelData) {
      toast.error('没有可导出的图纸');
      return;
    }
    try {
      exportPNG();
      toast.success('PNG 图纸已导出');
    } catch {
      toast.error('导出失败，请重试');
    }
  }, [originalPixelData, exportPNG]);

  const handleExportList = useCallback(() => {
    if (!colorMatchResult) {
      toast.error('请先完成配色匹配');
      return;
    }
    try {
      exportMaterialList();
      toast.success('材料清单已导出');
    } catch {
      toast.error('导出失败，请重试');
    }
  }, [colorMatchResult, exportMaterialList]);

  return (
    <TooltipProvider delayDuration={300}>
      <div className="min-h-screen flex flex-col bg-background">
        {/* 顶部标题栏 */}
        <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-[1600px] mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight">AI 智能拼豆像素化工具</h1>
                <p className="text-xs text-muted-foreground -mt-0.5 hidden sm:block">将图片转换为拼豆图纸</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isColorMatched && colorMatchResult && (
                <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Badge variant="secondary" className="text-xs">
                    {gridWidth}×{gridHeight}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {colorMatchResult.usedBeadColors.length} 色
                  </Badge>
                </div>
              )}
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                v1.0
              </a>
            </div>
          </div>
        </header>

        {/* 主内容区 */}
        <main className="flex-1 max-w-[1600px] mx-auto w-full px-4 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 h-full">
            {/* 左侧操作面板 */}
            <aside className="space-y-4">
              <ScrollArea className="lg:h-[calc(100vh-7rem)] lg:max-h-none max-h-[calc(100vh-12rem)] pr-2">
                <div className="space-y-4 pb-4">
                  {/* 图片上传 */}
                  <Card className="overflow-hidden">
                    <CardContent className="p-4">
                      <ImageUploader />
                    </CardContent>
                  </Card>

                  {/* 网格设置 */}
                  <Card className="overflow-hidden">
                    <CardContent className="p-4">
                      <GridSettings />
                    </CardContent>
                  </Card>

                  {/* 色库设置 */}
                  <Card className="overflow-hidden">
                    <CardContent className="p-4">
                      <ColorLibrarySettings />
                    </CardContent>
                  </Card>

                  {/* 操作按钮 */}
                  <Card className="overflow-hidden">
                    <CardContent className="p-4 space-y-3">
                      <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                        <Settings className="h-3.5 w-3.5" />
                        操作
                      </h3>

                      <div className="space-y-2">
                        <Button
                          className="w-full gap-2"
                          onClick={handleGeneratePreview}
                          disabled={!originalImage || isProcessing}
                        >
                          {isProcessing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Grid3X3 className="h-4 w-4" />
                          )}
                          生成像素预览
                        </Button>

                        <Button
                          className="w-full gap-2"
                          variant="secondary"
                          onClick={handleColorMatch}
                          disabled={!originalPixelData || isProcessing}
                        >
                          {isProcessing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Palette className="h-4 w-4" />
                          )}
                          AI 配色匹配
                        </Button>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-2 gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1.5 text-xs"
                              onClick={handleExportPNG}
                              disabled={!originalPixelData}
                            >
                              <Download className="h-3.5 w-3.5" />
                              导出 PNG
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>导出带网格线的拼豆图纸</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1.5 text-xs"
                              onClick={handleExportList}
                              disabled={!colorMatchResult}
                            >
                              <FileText className="h-3.5 w-3.5" />
                              材料清单
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>下载材料清单文本文件</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 编辑工具 */}
                  <Card className="overflow-hidden">
                    <CardContent className="p-4">
                      <EditorToolbar />
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </aside>

            {/* 右侧主内容区 */}
            <div className="space-y-4 min-w-0">
              {/* 视图切换标签 */}
              <div className="flex items-center justify-between">
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
                  <TabsList className="h-9">
                    <TabsTrigger value="original" className="gap-1.5 text-xs px-3" disabled={!originalImage}>
                      <ImageIcon className="h-3.5 w-3.5" />
                      原图
                    </TabsTrigger>
                    <TabsTrigger value="pixel" className="gap-1.5 text-xs px-3" disabled={!originalPixelData}>
                      <Grid3X3 className="h-3.5 w-3.5" />
                      像素图
                    </TabsTrigger>
                    <TabsTrigger value="matched" className="gap-1.5 text-xs px-3" disabled={!isColorMatched}>
                      <Palette className="h-3.5 w-3.5" />
                      配色图
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                {originalPixelData && (
                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs tabular-nums">
                      {gridWidth} × {gridHeight}
                    </Badge>
                    {isColorMatched && colorMatchResult && (
                      <Badge variant="outline" className="text-xs tabular-nums">
                        {colorMatchResult.usedBeadColors.length} 色 / {gridWidth * gridHeight} 格
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Canvas 画布 */}
              <Card className="overflow-hidden">
                <CardContent className="p-3">
                  <PatternCanvas />
                </CardContent>
              </Card>

              {/* 材料清单 */}
              {isColorMatched && (
                <Card className="overflow-hidden">
                  <CardContent className="p-4">
                    <MaterialList />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>

        {/* 底部状态栏 */}
        <footer className="border-t bg-card/80 backdrop-blur-sm sticky bottom-0 z-50">
          <div className="max-w-[1600px] mx-auto px-4 h-8 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              {isProcessing ? (
                <span className="flex items-center gap-1.5 text-amber-600">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  处理中...
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  就绪
                </span>
              )}
              {originalPixelData && (
                <span>网格: {gridWidth}×{gridHeight}</span>
              )}
              {isColorMatched && colorMatchResult && (
                <span>颜色: {colorMatchResult.usedBeadColors.length} 色</span>
              )}
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span>AI 智能拼豆像素化工具</span>
              <span>·</span>
              <span>纯前端本地运行</span>
            </div>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
}
