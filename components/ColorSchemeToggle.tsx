import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { IconMoonStars, IconSun } from "@tabler/icons";

export function ColorSchemeToggle() {
  return (
    <ActionIcon
      // onClick={() => toggleColorScheme()}
      size="xl"
    >
      <IconSun size={20} stroke={1.5} />
    </ActionIcon>
  );
}
