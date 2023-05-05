import { useState } from "react";

const useDebounce = () => {
    const [timerId, setTimerId] = useState<NodeJS.Timer | null>(null);

    const debounce = (callback: any, time: number) => {
        if (timerId) {
            clearTimeout(timerId);
        }

        setTimerId(setTimeout(callback, time));
    };

    return debounce;
}

export default useDebounce;