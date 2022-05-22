import "src/styles/app.css";
// import "tailwindcss/tailwind.css"; // リセットCSSがMantineのButtonを消してしまう
import "nprogress/nprogress.css";

import { ApolloProvider } from "@apollo/client";
import type { CustomAppProps } from "next/app";
import Router, { useRouter } from "next/router";
import { SessionProvider } from "next-auth/react";
import { DefaultSeo } from "next-seo";
import NProgress from "nprogress";
import { memo, useCallback } from "react";
import type { VFC } from "react";
import { initializeApollo } from "src/graphql/apollo/client";
import { MantineProvider, ColorSchemeProvider, ColorScheme } from "@mantine/core";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";
import { NotificationsProvider } from "@mantine/notifications";
import { SpotlightProvider } from "@mantine/spotlight";

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

const htmlElement = typeof window === "object" ? document.documentElement : null;

const App: VFC<CustomAppProps> = memo((props) => {
  const apolloClient = initializeApollo();
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });
  const { push } = useRouter();

  const toggleColorScheme = useCallback(() => {
    setColorScheme((prev) => {
      const newValue: ColorScheme = prev === "dark" ? "light" : "dark";
      htmlElement?.classList.remove(prev);
      htmlElement?.classList.add(newValue);
      return newValue;
    });
  }, [colorScheme]);

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
            <SpotlightProvider
              actions={[{ title: "Home", description: "ホームへ戻る", onTrigger: () => push("/") }]}
              shortcut="mod + k"
            >
              <NotificationsProvider>
                <DefaultSeo
                  title={"ニュースシェア"}
                  titleTemplate={"%s"}
                  description="ニュースシェア"
                  additionalMetaTags={[{ property: "", content: "" }]}
                  additionalLinkTags={[
                    {
                      rel: "manifest",
                      href: "/pwa/manifest.json",
                    },
                  ]}
                />
                {getLayout(<props.Component {...props.pageProps} />)}
              </NotificationsProvider>
            </SpotlightProvider>
          </MantineProvider>
        </ColorSchemeProvider>
      </ApolloProvider>
    </SessionProvider>
  );
});

export default App;

App.displayName = "App";
