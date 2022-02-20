import { KBarResults, useMatches } from "kbar";
import type { ActionImpl, ActionId } from "kbar";

import { forwardRef, useMemo } from "react";
import type { VFC } from "react";

export const RenderKBarResults: VFC = () => {
  const { results, rootActionId } = useMatches();
  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) => {
        if (typeof item === "string") return <div className="p-1">{item.toString()}</div>;
        return <ResultItem active={active} action={item} currentRootActionId={rootActionId} />;
      }}
    />
  );
};

type ResultItemProps = {
  action: ActionImpl;
  active: boolean;
  currentRootActionId?: ActionId | null;
};

const ResultItem = forwardRef<HTMLDivElement, ResultItemProps>(
  ({ action, active, currentRootActionId }, ref) => {
    const ancestors = useMemo(() => {
      if (!currentRootActionId) return action.ancestors;
      const index = action.ancestors.findIndex((ancestor) => ancestor.id === currentRootActionId);
      // +1 removes the currentRootAction; e.g.
      // if we are on the "Set theme" parent action,
      // the UI should not display "Set theme… > Dark"
      // but rather just "Dark"
      return action.ancestors.slice(index + 1);
    }, [action.ancestors, currentRootActionId]);

    return (
      <div
        ref={ref}
        className={`py-3 px-4 flex items-center justify-between border-l-2 border-transparent cursor-pointer shadow-xl ${
          active ? "border-l-2 border-black bg-gray-100" : "bg-white"
        }`}
      >
        <div className="flex gap-2 items-center text-sm">
          {action.icon && action.icon}
          <div className="flex flex-col">
            <div>
              {ancestors.length > 0 &&
                ancestors.map((ancestor) => (
                  <div key={ancestor.id}>
                    <span className="opacity-50 mr-2">{ancestor.name}</span>
                    <span className="mr-2">&rsaquo;</span>
                  </div>
                ))}
              <span>{action.name}</span>
            </div>
            {action.subtitle && <span className="text-sm">{action.subtitle}</span>}
          </div>
        </div>
        {action.shortcut?.length ? (
          <div aria-hidden className="grid gap-1 grid-flow-col">
            {action.shortcut.map((sc) => (
              <kbd key={sc} className="text-sm py-1 px-2 bg-gray-400 rounded">
                {sc}
              </kbd>
            ))}
          </div>
        ) : null}
      </div>
    );
  },
);
