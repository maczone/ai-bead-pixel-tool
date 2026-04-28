'use client';

import { useCallback, useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBeadStore } from '@/store/bead-store';

export function ImageUploader() {
  const { imagePreviewUrl, imageFileName, setImage, isProcessing } = useBeadStore();
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    try {
      await setImage(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传失败');
    }
  }, [setImage]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [handleFile]);

  const handleRemove = useCallback(() => {
    useBeadStore.setState({
      originalImage: null,
      imagePreviewUrl: null,
      imageFileName: null,
      originalPixelData: null,
      colorMatchResult: null,
      isColorMatched: false,
      activeTab: 'original',
    });
  }, []);

  if (imagePreviewUrl) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
            <ImageIcon className="h-3.5 w-3.5" />
            原始图片
          </h3>
          {!isProcessing && (
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive" onClick={handleRemove}>
              <X className="h-3 w-3 mr-1" />
              移除
            </Button>
          )}
        </div>
        <div className="relative rounded-lg overflow-hidden border bg-muted/30">
          <img
            src={imagePreviewUrl}
            alt="Preview"
            className="w-full h-auto max-h-40 object-contain"
          />
          {isProcessing && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">{imageFileName}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
        <Upload className="h-3.5 w-3.5" />
        上传图片
      </h3>
      <Card
        className={`border-2 border-dashed transition-all duration-200 cursor-pointer hover:border-primary/50 hover:bg-primary/5 ${
          isDragOver ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-muted-foreground/25'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="flex flex-col items-center justify-center py-8 px-4">
          <div className={`rounded-full p-3 mb-3 transition-colors ${isDragOver ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
            <Upload className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium">
            {isDragOver ? '松开以上传' : '拖拽图片到此处'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">或点击选择文件</p>
          <p className="text-xs text-muted-foreground/70 mt-2">支持 JPG / PNG / WebP，最大 20MB</p>
        </CardContent>
      </Card>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <X className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
}
