import DrawerButton from "./DrawerButton";

interface Props {
  isMobileDevice: boolean;
}

function Header({ isMobileDevice }: Props) {
  return (
    <div className="text-5xl text-center mb-6 relative">
      AI Scratch
      <div
        className={`absolute top-0 bottom-0 left-0 flex align-middle lg:hidden ${
          isMobileDevice ? "hidden" : ""
        }`}
      >
        <DrawerButton />
      </div>
    </div>
  );
}

export default Header;
