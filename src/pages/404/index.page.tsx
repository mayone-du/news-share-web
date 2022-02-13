import type { CustomNextPage } from "next";
import { NextSeo } from "next-seo";
import { Layout } from "src/layouts";

const NotFoundPage: CustomNextPage = () => {
  return (
    <>
      <NextSeo title="お探しのページは見つかりませんでした。" />

      <div>
        <h2 className="text-3xl font-bold text-center">404 Not Found.</h2>
        <p className="py-4 text-center">お探しのページは見つかりませんでした。</p>
      </div>
    </>
  );
};

export default NotFoundPage;

NotFoundPage.getLayout = Layout;
