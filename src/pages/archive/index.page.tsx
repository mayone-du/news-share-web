import { CustomNextPage } from "next";
import { NextSeo } from "next-seo";
import { ROUTE_LABELS } from "src/constants";
import { Layout } from "src/layouts";

const ArchiveIndexPage: CustomNextPage = () => {
  return (
    <>
      <NextSeo title={ROUTE_LABELS.ARCHIVE} />
      ArchivePage
    </>
  );
};

ArchiveIndexPage.getLayout = Layout;

export default ArchiveIndexPage;
