import "tailwindcss/tailwind.css";
import "nprogress/nprogress.css";

import { ApolloProvider } from "@apollo/client";
import type { CustomAppProps } from "next/app";
import Router from "next/router";
// import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { DefaultSeo } from "next-seo";
import { ThemeProvider } from "next-themes";
import NProgress from "nprogress";
import { memo } from "react";
import { Toaster } from "react-hot-toast";
import { initializeApollo } from "src/graphql/apollo/client";

NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.25 });
Router.events.on("routeChangeStart", () => {
  return NProgress.start();
});
Router.events.on("routeChangeComplete", () => {
  return NProgress.done();
});
Router.events.on("routeChangeError", () => {
  return NProgress.done();
});

const App = memo((props: CustomAppProps) => {
  const apolloClient = initializeApollo();

  const getLayout =
    props.Component.getLayout ||
    ((page) => {
      return page;
    });

  return (
    <SessionProvider session={props.pageProps.session}>
      <ApolloProvider client={apolloClient}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <DefaultSeo
            title={"Template"}
            titleTemplate={"%s | サイトの名前"}
            description="Template Repo"
            additionalMetaTags={[{ property: "", content: "" }]}
            additionalLinkTags={[
              {
                rel: "manifest",
                href: "/pwa/manifest.json",
              },
            ]}
          />
          {getLayout(<props.Component {...props.pageProps} />)}
          <Toaster toastOptions={{ duration: 2500 }} />
        </ThemeProvider>
      </ApolloProvider>
    </SessionProvider>
  );
});

export default App;

App.displayName = "App";
