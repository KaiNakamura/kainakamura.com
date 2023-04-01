import { ColorSchemeToggle } from "@components/ColorSchemeToggle";
import NavButton from "@components/NavButton";
import NavButtons from "@components/NavButtons";
import {
  AppShell,
  Burger,
  Group,
  Header,
  MediaQuery,
  Navbar,
  Stack,
} from "@mantine/core";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Shell(props: AppProps) {
  const { Component, pageProps } = props;
  const [opened, setOpened] = useState(false);
  const dynamicRoute = useRouter().asPath;

  useEffect(() => setOpened(false), [dynamicRoute]);

  return (
    <AppShell
      padding={0}
      sx={() => ({ backgroundColor: "#EEEEEE" })}
      navbar={
        <>
          {opened && (
            <MediaQuery largerThan="md" styles={{ display: "none" }}>
              <Navbar
                p="md"
                withBorder={false}
                sx={() => ({ backgroundColor: "#2A2C2D" })}
              >
                <Stack>
                  <NavButton text="Home" />
                  <NavButtons />
                </Stack>
              </Navbar>
            </MediaQuery>
          )}
        </>
      }
      header={
        <Header
          height={70}
          px="md"
          py="sm"
          withBorder={false}
          sx={() => ({ backgroundColor: "#232526" })}
        >
          <MediaQuery largerThan="md" styles={{ display: "none" }}>
            <Group position="apart">
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                title="Toggle Navigation"
                size="sm"
                color="#EEEEEE"
              />
              <NavButton text="Kai Nakamura" isHomePage={true} />
              <ColorSchemeToggle />
            </Group>
          </MediaQuery>
          <MediaQuery smallerThan="md" styles={{ display: "none" }}>
            <Group position="apart">
              <NavButton text="Kai Nakamura" isHomePage={true} />
              <Group spacing={60}>
                <NavButtons />
                <ColorSchemeToggle />
              </Group>
            </Group>
          </MediaQuery>
        </Header>
      }
    >
      <Component {...pageProps} />
    </AppShell>
  );
}
