import { CustomNextPage } from "next";
import { NextSeo } from "next-seo";
import { ROUTE_LABELS } from "src/constants";
import { Layout } from "src/layouts";

const EventIndexPage: CustomNextPage = () => {
  return (
    <>
      <NextSeo title={ROUTE_LABELS.EVENT} />
      <p>運営はメモを投稿でき、拡大したiframeとメモを同時に見れる</p>
      <iframe src="https://github.blog/" className="block w-full h-96 border" />
    </>
  );
};

EventIndexPage.getLayout = Layout;

export default EventIndexPage;
