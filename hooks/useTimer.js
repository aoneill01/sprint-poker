import { intervalToDuration } from "date-fns";
import { useEffect, useState } from "react";

export default function useTimer(start) {
  const [time, setTime] = useState(null);
  useEffect(() => {
    const id = setInterval(() => {
      const duration = intervalToDuration({ start, end: new Date() });
      setTime(
        `${duration.minutes}:${duration.seconds.toString().padStart(2, "0")}`
      );
    }, 500);
    return () => clearInterval(id);
  }, [start]);
  return time;
}
