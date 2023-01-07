import { Text, UnstyledButton } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import useStyles from "@styles/styles";

export interface NavButtonProps {
  text: string;
  href?: string;
  markActive?: boolean;
}

export default function NavButton({
  text,
  href = "/",
  markActive = true,
}: NavButtonProps) {
  const { classes } = useStyles();
  const router = useRouter();

  return (
    <UnstyledButton>
      <Link href={href}>
        <Text
          className={
            classes.navButton +
            " " +
            (markActive && router.pathname == href
              ? classes.navButtonActive
              : "")
          }
        >
          {text}
        </Text>
      </Link>
    </UnstyledButton>
  );
}
