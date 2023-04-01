import Footer from "@components/Footer";
import NavBar from "@components/Navbar";
import "@styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>
          Kai Nakamura
          {pageProps.title && " - ".concat(pageProps.title)}
        </title>
      </Head>
      <NavBar />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}
