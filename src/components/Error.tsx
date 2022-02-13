import type { VFC } from "react";

type Props = {
  errorMessage?: string;
};

export const Error: VFC<Props> = (props) => {
  return (
    <div className="py-4 bg-green-500">
      <h2 className="font-bold text-center">Error</h2>
      <p>{props.errorMessage ?? "エラーが発生しました。"}</p>
    </div>
  );
};
