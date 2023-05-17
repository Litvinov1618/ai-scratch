const checkDirection = (touchstartX: number, touchendX: number, closeDrawer: () => void, openDrawer: () => void) => {
    if (touchendX < touchstartX) {
        closeDrawer();
        return;
    };

    openDrawer();
}

const registerSwipeListeners = (closeDrawer: () => void, openDrawer: () => void) => {
    let touchstartX = 0;
    let touchendX = 0;

    const listenTouchStart = (e: TouchEvent) => {
        touchstartX = e.changedTouches[0].screenX;
    };
    const listenTouchEnd = (e: TouchEvent) => {
        touchendX = e.changedTouches[0].screenX;
        checkDirection(touchstartX, touchendX, closeDrawer, openDrawer);
    };

    document.addEventListener("touchstart", listenTouchStart);
    document.addEventListener("touchend", listenTouchEnd);

    return () => {
        document.removeEventListener("touchstart", listenTouchStart);
        document.removeEventListener("touchend", listenTouchEnd);
    };
};

export default registerSwipeListeners;