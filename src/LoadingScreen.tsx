import { useEffect, useState } from "react";
import loadingMessages from "./loadingMessages";

function LoadingScreen() {
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  useEffect(() => {
    setLoadingMessageIndex(Math.floor(Math.random() * loadingMessages.length));
  }, []);

  return (
    <div className="backdrop-blur-sm absolute top-0 left-0 right-0 bottom-0 z-20 flex items-center justify-center">
      <div className="flex flex-col items-center gap-5 w-[380px] max-sm:w-[280px] whitespace-pre-wrap">
        {loadingMessages[loadingMessageIndex]}
        <progress className="progress w-56"></progress>
      </div>
    </div>
  );
}

export default LoadingScreen;
