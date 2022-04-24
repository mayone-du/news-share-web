import "src/styles/app.css";
// import "tailwindcss/tailwind.css"; // リセットCSSがMantineのButtonを消してしまう
import "nprogress/nprogress.css";

import { ApolloProvider } from "@apollo/client";
import type { CustomAppProps } from "next/app";
import Router from "next/router";
import { SessionProvider } from "next-auth/react";
import { DefaultSeo } from "next-seo";
import NProgress from "nprogress";
import { memo } from "react";
import type { VFC } from "react";
import { Toaster } from "react-hot-toast";
import { initializeApollo } from "src/graphql/apollo/client";
import { MantineProvider, ColorSchemeProvider, ColorScheme } from "@mantine/core";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";

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
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  const getLayout =
    props.Component.getLayout ||
    ((page) => {
      return page;
    });

  return (
    <SessionProvider session={props.pageProps.session}>
      <ApolloProvider client={apolloClient}>
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
          <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme }}>
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
        </ColorSchemeProvider>
      </ApolloProvider>
    </SessionProvider>
  );
});

export default App;

App.displayName = "App";
