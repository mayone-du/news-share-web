import { CustomNextPage } from "next";
import { NextSeo } from "next-seo";
import { ROUTE_LABELS } from "src/constants";
import { Layout } from "src/layouts";

const EventIndexPage: CustomNextPage = () => {
  return (
    <>
      <NextSeo title={ROUTE_LABELS.EVENT} />
      <iframe src="https://github.blog/" />
    </>
  );
};

EventIndexPage.getLayout = Layout;

export default EventIndexPage;
