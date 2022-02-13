import type { NextRequest } from "next/server";
// import { NextResponse } from "next/server";

export const middleware = (_req: NextRequest) => {
  // eslint-disable-next-line no-console
  console.log("middleware");
  // const res = NextResponse.next();
  // res.headers.set("x-middleware-modified-at", new Date().getTime().toString());
  // return res;
};
