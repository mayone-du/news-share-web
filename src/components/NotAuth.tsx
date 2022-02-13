import type { VFC } from "react";

export const NotAuth: VFC = () => {
  return (
    <div className="min-h-screen">
      <h2 className="py-4 text-2xl font-bold text-center">認証後に利用可能です。</h2>
    </div>
  );
};
