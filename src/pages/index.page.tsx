import type { CustomNextPage } from "next";
import { BreadcrumbJsonLd, NextSeo } from "next-seo";
import { NewsList } from "src/components/NewsList";
import { ROUTE_LABELS } from "src/constants/labels";
import { Layout } from "src/layouts";

const IndexPage: CustomNextPage = () => {
  return (
    <>
      <NextSeo title={ROUTE_LABELS.INDEX} />
      <BreadcrumbJsonLd
        itemListElements={[
          {
            position: 1,
            name: "HOME",
            item: "http://localhost:3000/",
          },
        ]}
      />
      <NewsList />
    </>
  );
};

export default IndexPage;

IndexPage.getLayout = Layout;
