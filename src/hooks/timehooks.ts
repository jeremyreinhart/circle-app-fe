import { useEffect, useState } from "react";
import { timeAgo } from "../helper/time";

export function useTimeAgo(dateString: string) {
  const [relativeTime, setRelativeTime] = useState(timeAgo(dateString));

  useEffect(() => {
    const updateTime = () => {
      setRelativeTime(timeAgo(dateString));
    };

    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, [dateString]);

  return relativeTime;
}
