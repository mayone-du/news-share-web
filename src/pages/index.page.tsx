import type { CustomNextPage } from "next";
import { BreadcrumbJsonLd, NextSeo } from "next-seo";
import { NewsList } from "src/components/NewsList";
import { TITLES } from "src/constants/titles";
import { Layout } from "src/layouts";

const IndexPage: CustomNextPage = () => {
  return (
    <>
      <NextSeo title={TITLES.HOME} />
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
