import type { CustomNextPage } from "next";
import { NextSeo } from "next-seo";
import { ROUTE_LABELS } from "src/constants/labels";
import { Layout } from "src/layouts";

const AboutIndexPage: CustomNextPage = () => {
  return (
    <>
      <NextSeo title={ROUTE_LABELS.ABOUT} />
      <div className="prose prose-slate">
        <h1>このサービスについて</h1>
        <p>このサービスは、IT_KINGDOMで使用しているニュースシェア専用アプリです。</p>

        <h2>使い方</h2>
        <p>使い方の説明</p>

        <h2>注意事項、禁止事項等</h2>
      </div>
    </>
  );
};

export default AboutIndexPage;

AboutIndexPage.getLayout = Layout;
