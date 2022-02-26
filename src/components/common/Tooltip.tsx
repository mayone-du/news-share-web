import { memo, useRef } from "react";

// ツールチップ内に表示するためのprops
type Props = {
  tooltipText: string;
};

// ツールチップ
export const Tooltip: React.FC<Props> = memo((props) => {
  // ツールチップの文言自体のためのref
  const ref = useRef<HTMLDivElement>(null);

  // マウスが乗ったらツールチップを表示
  const handleMouseEnter = () => {
    if (!ref.current) return;
    ref.current.style.opacity = "1";
    ref.current.style.visibility = "visible";
  };
  // マウスが離れたらツールチップを非表示
  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.opacity = "0";
    ref.current.style.visibility = "hidden";
  };

  return (
    <div className="flex relative items-center">
      <div
        className="flex absolute left-1/2 top-full invisible z-10 items-center px-2 mx-auto mt-2 text-xs text-white whitespace-nowrap bg-black rounded transition-all duration-150 transform -translate-x-1/2 before:block before:absolute before:-top-1 before:left-1/2 before:z-0 py-[2px] before:w-2 before:h-2 before:bg-black before:transform before:rotate-45 before:-translate-x-1/2"
        ref={ref}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {props.tooltipText}
      </div>
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {props.children}
      </div>
    </div>
  );
});

Tooltip.displayName = "Tooltip";
