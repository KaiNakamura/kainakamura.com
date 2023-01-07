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
  Stack
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
      navbar={
        <>
          {opened && (
            <Navbar p="md">
              <Stack>
                <NavButton text="Home" />
                <NavButtons />
              </Stack>
            </Navbar>
          )}
        </>
      }
      header={
        <Header
          height={70} px="md" py="sm"
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[5]
                : theme.colors.dark[5]
          })}
        >
          <MediaQuery largerThan="md" styles={{ display: "none" }}>
            <Group position="apart">
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
              />
              <NavButton text="Kai Nakamura" markActive={false} />
              <ColorSchemeToggle />
            </Group>
          </MediaQuery>
          <MediaQuery smallerThan="md" styles={{ display: "none" }}>
            <Group position="apart">
              <NavButton text="Kai Nakamura" markActive={false} />
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
