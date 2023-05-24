interface Props {
  content: React.ReactNode;
  isDrawerOpen: boolean;
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode | React.ReactNode[];
}

function Drawer({
  children,
  content,
  isDrawerOpen,
  setIsDrawerOpen,
}: Props) {
  return (
    <div className="drawer drawer-mobile">
      <input
        id="my-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={isDrawerOpen}
        onChange={() => setIsDrawerOpen(!isDrawerOpen)}
      />
      <div className="drawer-content isolate p-4 lg:pl-1 max-sm:px-2 max-sm:py-4 flex flex-col flex-1 h-[100%]">
        {children}
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay" />
        <div className="flex bg-base-100 justify-between w-96 max-sm:w-[320px] max-lg:w-[500px]">
          {content}
          <div className="divider divider-horizontal ml-0 max-lg:invisible max-lg:w-0 max-lg:mr-0" />
        </div>
      </div>
    </div>
  );
}

export default Drawer;
