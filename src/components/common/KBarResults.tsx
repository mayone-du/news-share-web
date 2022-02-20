import { useMatches } from "kbar";

import type { VFC } from "react";

export const KBarResults: VFC = () => {
  const { results } = useMatches();
  return (
    <div>
      <h1>KBar Results</h1>
      <ul>
        {results.map((result, i) => {
          if (typeof result === "string") return;
          return (
            <li key={result.id}>
              <div className="border p-1">{result.name}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
