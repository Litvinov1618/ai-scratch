import DrawerButton from "./DrawerButton";

function Header() {
  return (
    <div className="text-4xl text-center mb-1 relative sm:mb-6 sm:text-5xl">
      AI Scratch
      <div
        className="absolute top-0 bottom-0 left-0 flex align-middle lg:hidden"
      >
        <DrawerButton />
      </div>
    </div>
  );
}

export default Header;
