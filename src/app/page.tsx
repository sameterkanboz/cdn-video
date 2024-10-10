"use client";
import { Stream } from "@cloudflare/stream-react";

export default function Home() {
  const videoIdOrSignedToken = process.env.NEXT_PUBLIC_VIDEO_KEY;

  return (
    <main className="w-screen h-screen">
      <div className="absolute right-0 bottom-10">
        <div className="w-64 h-64 relative  rounded-full border-4 overflow-hidden">
          {videoIdOrSignedToken && (
            <Stream
              responsive
              className="absolute inset-0 w-full h-full object-cover"
              controls
              autoplay
              src={videoIdOrSignedToken}
            />
          )}
        </div>
      </div>
    </main>
  );
}
