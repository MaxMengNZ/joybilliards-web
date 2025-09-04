"use client";
import {useEffect, useRef} from "react";
import QRCode from "qrcode";

export function MemberQR({payload}: {payload: string}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, payload, {width: 180, margin: 1});
  }, [payload]);

  return (
    <div className="inline-flex flex-col items-center">
      <canvas ref={canvasRef} aria-label="Member QR" />
      <span className="text-xs text-gray-500 mt-2 select-all break-all max-w-[260px] text-center">{payload}</span>
    </div>
  );
}


