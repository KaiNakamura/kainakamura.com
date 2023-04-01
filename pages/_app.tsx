import Shell from "@components/Shell";
import { ColorScheme, MantineProvider } from "@mantine/core";
import { AppProps } from "next/app";
import Head from "next/head";

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
  return (
    <>
      <Head>
        <title>Kai Nakamura</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          fontFamily: "Open Sans, sans-serif",
          headings: { fontFamily: "Ubuntu, sans-serif" },
        }}
      >
        <Shell {...props} />
      </MantineProvider>
    </>
  );
}
