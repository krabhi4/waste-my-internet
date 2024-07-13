import { env } from "@/env";
import { useState, useEffect, useRef } from "react";

interface DataWasterHookProps {
  unlimitedData: boolean;
  fileSize: number;
  fileSizeUnit: "MB" | "GB" | "TB";
  threads: number;
}

interface DataWasterHookResult {
  wasting: boolean;
  totalWasted: number;
  wastingSpeed: number;
  elapsedTime: number;
  startWasting: () => void;
  stopWasting: () => void;
}

const useDataWaster = ({
  unlimitedData,
  fileSize,
  fileSizeUnit,
  threads,
}: DataWasterHookProps): DataWasterHookResult => {
  const [wasting, setWasting] = useState(false);
  const [totalWasted, setTotalWasted] = useState(0);
  const [wastingSpeed, setWastingSpeed] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  const websocketsRef = useRef<WebSocket[]>([]);
  const wastingRef = useRef(false);
  const startTimeRef = useRef<number | null>(null);
  const goalRef = useRef<number>(0);
  const lastUpdateTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (wasting) {
      interval = setInterval(() => {
        if (startTimeRef.current) {
          setElapsedTime(
            Math.floor((Date.now() - startTimeRef.current) / 1000),
          );
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [wasting]);

  const wasteData = (ws: WebSocket) => {
    if (!wastingRef.current) return;

    const data = new ArrayBuffer(1024 * 1024); // 1 MB data
    try {
      ws.send(data);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  const startWasting = () => {
    setWasting(true);
    wastingRef.current = true;
    startTimeRef.current = Date.now();
    lastUpdateTimeRef.current = Date.now();

    if (!unlimitedData) {
      const multiplier = {
        MB: 1024 * 1024,
        GB: 1024 * 1024 * 1024,
        TB: 1024 * 1024 * 1024 * 1024,
      };
      goalRef.current = fileSize * multiplier[fileSizeUnit];
    }

    for (let i = 0; i < threads; i++) {
      const ws = new WebSocket(env.NEXT_PUBLIC_WEBSOCKET_URL);

      ws.onopen = () => {
        wasteData(ws);
      };

      ws.onmessage = (event: MessageEvent) => {
        const now = Date.now();
        const timeDiff = now - lastUpdateTimeRef.current;

        setTotalWasted((prev) => {
          const dataSize =
            event.data instanceof ArrayBuffer
              ? event.data.byteLength
              : event.data instanceof Blob
                ? event.data.size
                : typeof event.data === "string"
                  ? event.data.length
                  : 0;

          const newTotal = prev + dataSize;
          const newSpeed = (dataSize / timeDiff) * 1000; // bytes per second

          setWastingSpeed(newSpeed);
          lastUpdateTimeRef.current = now;

          if (!unlimitedData && newTotal >= goalRef.current) {
            stopWasting();
          }

          return newTotal;
        });

        if (wastingRef.current) {
          wasteData(ws);
        }
      };

      ws.onerror = (error) => {
        console.error(`WebSocket ${i + 1} error:`, error);
      };

      ws.onclose = () => {
        console.log(`WebSocket ${i + 1} closed`);
      };

      websocketsRef.current.push(ws);
    }
  };

  const stopWasting = () => {
    setWasting(false);
    wastingRef.current = false;
    websocketsRef.current.forEach((ws) => ws.close());
    websocketsRef.current = [];
  };

  return {
    wasting,
    totalWasted,
    wastingSpeed,
    elapsedTime,
    startWasting,
    stopWasting,
  };
};

export default useDataWaster;
