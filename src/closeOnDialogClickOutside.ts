const closeOnDialogClickOutside = (e: React.MouseEvent, close: () => void) => {
    if (e.target !== e.currentTarget) return;

    close();
};

export default closeOnDialogClickOutside;