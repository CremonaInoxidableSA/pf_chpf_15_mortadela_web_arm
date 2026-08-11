"use client";

import { useEffect, useRef } from "react";

type HlsInstance = import("hls.js").default;

type Props = {
  src: string;
  autoPlay?: boolean;
  muted?: boolean;
  controls?: boolean;
  poster?: string;
  onLoadedData?: () => void;
  onError?: () => void;
  className?: string;
};

export default function HlsPlayer({
  src,
  autoPlay = true,
  muted = true,
  controls = false,
  poster,
  onLoadedData,
  onError,
  className = "",
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<HlsInstance | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    let isMounted = true;

    const setup = async () => {
      if (!isMounted) return;

      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
        video.currentTime = video.duration || 0;
        return;
      }

      const HlsModule = (await import("hls.js")).default;

      if (HlsModule.isSupported()) {
        const hls = new HlsModule({
          lowLatencyMode: true,
          enableWorker: true,
          backBufferLength: 30,
          maxBufferSize: 60 * 1000 * 1000,
          maxBufferLength: 30,
        });

        if (!isMounted) {
          hls.destroy();
          return;
        }

        hlsRef.current = hls;
        hls.loadSource(src);
        hls.attachMedia(video);

        hls.on(HlsModule.Events.MANIFEST_PARSED, () => {
          if (!isMounted) return;
          if (video.readyState > 0) {
            video.currentTime = video.duration || 0;
          }
          video.play().catch(() => {});
        });

        hls.on(
          HlsModule.Events.ERROR,
          (_event: unknown, data: { fatal: boolean; type: string }) => {
            if (!isMounted) return;
            if (data.fatal) {
              switch (data.type) {
                case HlsModule.ErrorTypes.NETWORK_ERROR:
                  hls.startLoad();
                  break;
                case HlsModule.ErrorTypes.MEDIA_ERROR:
                  hls.recoverMediaError();
                  break;
                default:
                  hls.destroy();
                  hlsRef.current = null;
                  onError?.();
                  break;
              }
            }
          },
        );
      }
    };

    setup();

    const handleVisibility = () => {
      if (!isMounted) return;
      if (
        document.visibilityState === "visible" &&
        video.src &&
        !video.paused
      ) {
        setup();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      isMounted = false;
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (video) {
        video.src = "";
        video.pause();
      }
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [src, onError]);

  return (
    <video
      ref={videoRef}
      playsInline
      autoPlay={autoPlay}
      muted={muted}
      controls={controls}
      poster={poster}
      onLoadedData={onLoadedData}
      onError={onError}
      className={`w-full h-full object-cover rounded-md bg-black ${className}`}
    />
  );
}
