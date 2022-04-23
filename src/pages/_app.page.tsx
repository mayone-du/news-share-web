import "src/styles/app.css";
// import "tailwindcss/tailwind.css"; // リセットCSSがMantineのButtonを消してしまう
import "nprogress/nprogress.css";

import { ApolloProvider } from "@apollo/client";
import type { CustomAppProps } from "next/app";
import Router from "next/router";
import { SessionProvider } from "next-auth/react";
import { DefaultSeo } from "next-seo";
import { ThemeProvider } from "next-themes";
import NProgress from "nprogress";
import { memo } from "react";
import type { VFC } from "react";
import { Toaster } from "react-hot-toast";
import { initializeApollo } from "src/graphql/apollo/client";
import { MantineProvider } from "@mantine/core";

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

const App: VFC<CustomAppProps> = memo((props) => {
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
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
              colorScheme: "light",
              primaryColor: "cyan",
            }}
          >
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
          </MantineProvider>
        </ThemeProvider>
      </ApolloProvider>
    </SessionProvider>
  );
});

export default App;

App.displayName = "App";
