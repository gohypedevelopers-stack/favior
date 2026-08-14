"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, Trash2, Upload } from "lucide-react";

type MediaItem = {
  id: string;
  file: File;
  name: string;
  url: string;
};

export function ProductMediaUploader({ onFilesChange }: { onFilesChange?: (files: File[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const objectUrls = useRef(new Set<string>());
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => () => {
    objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  useEffect(() => {
    onFilesChange?.(media.map((item) => item.file));
  }, [media, onFilesChange]);

  function addFiles(files: File[]) {
    const supportedFiles = files.filter((file) => file.type.startsWith("image/"));
    if (supportedFiles.length === 0) {
      setError("Choose an image file.");
      return;
    }

    setError(supportedFiles.length === files.length ? "" : "Unsupported files were skipped.");
    const newMedia = supportedFiles.map((file) => {
      const url = URL.createObjectURL(file);
      objectUrls.current.add(url);
      return {
        id: crypto.randomUUID(),
        file,
        name: file.name,
        url,
      } satisfies MediaItem;
    });
    setMedia((current) => [...current, ...newMedia]);
  }

  function removeMedia(item: MediaItem) {
    URL.revokeObjectURL(item.url);
    objectUrls.current.delete(item.url);
    setMedia((current) => current.filter((entry) => entry.id !== item.id));
  }

  return (
    <div style={{"marginTop":"calc(0.75rem * calc(1 - 0))","marginBottom":"calc(0.75rem * 0)"}}>
      <input
        ref={inputRef}
        type="file"
        accept="image/avif,image/gif,image/jpeg,image/png,image/webp"
        multiple
        style={{"position":"absolute","width":"1px","height":"1px","padding":"0","margin":"-1px","overflow":"hidden","clip":"rect(0, 0, 0, 0)","whiteSpace":"nowrap","borderWidth":"0"}}
        onChange={(event) => {
          if (event.target.files) addFiles(Array.from(event.target.files));
          event.target.value = "";
        }}
      />

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          addFiles(Array.from(event.dataTransfer.files));
        }}
        className={`flex min-h-28 flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-center transition-colors ${
          isDragging ? "border-black bg-black/[0.04]" : "border-black/35"
        }`}
      >
        <button type="button" onClick={() => inputRef.current?.click()} style={{"display":"inline-flex","alignItems":"center","gap":"0.375rem","borderRadius":"0.5rem","borderWidth":"1px","paddingLeft":"0.75rem","paddingRight":"0.75rem","paddingTop":"0.375rem","paddingBottom":"0.375rem","fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500","backgroundColor":"rgb(0,0,0,0.03)"}}>
          <Upload className="size-3.5" /> Upload new
        </button>
        <span style={{"fontSize":"0.75rem","lineHeight":"1rem"}}>Drop product images here, or choose files</span>
      </div>

      {error ? <p role="alert" style={{"fontSize":"0.75rem","lineHeight":"1rem","color":"rgb(185,28,28)"}}>{error}</p> : null}

      {media.length > 0 ? (
        <div style={{"display":"grid","gridTemplateColumns":"repeat(2, minmax(0, 1fr))","gap":"0.75rem"}}>
          {media.map((item) => (
            <div key={item.id} style={{"position":"relative","overflow":"hidden","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(0,0,0,0.02)"}}>
              <img src={item.url} alt={item.name} style={{"aspectRatio":"1 / 1","width":"100%","objectFit":"cover"}} />
              <div style={{"display":"flex","alignItems":"center","gap":"0.375rem","borderTopWidth":"1px","borderColor":"rgb(0,0,0,0.1)","backgroundColor":"rgb(255,255,255)","paddingLeft":"0.5rem","paddingRight":"0.5rem","paddingTop":"0.375rem","paddingBottom":"0.375rem"}}>
                <ImagePlus style={{"flexShrink":"0","color":"rgb(0,0,0,0.5)"}} />
                <span style={{"minWidth":"0px","flex":"1 1 0%","overflow":"hidden","textOverflow":"ellipsis","whiteSpace":"nowrap","fontSize":"0.75rem","lineHeight":"1rem"}}>{item.name}</span>
                <button type="button" aria-label={`Remove ${item.name}`} onClick={() => removeMedia(item)} style={{"borderRadius":"0.25rem","padding":"0.25rem","color":"rgb(185,28,28)","backgroundColor":"rgb(254,242,242)"}}><Trash2 className="size-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
