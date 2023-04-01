import { Text, UnstyledButton } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import useStyles from "@styles/styles";

export interface NavButtonProps {
  text: string;
  href?: string;
  isHomePage?: boolean;
}

export default function NavButton({
  text,
  href = "/",
  isHomePage = false,
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
            (router.pathname == href ? classes.navButtonActive : "") +
            " " +
            (isHomePage ? classes.navButtonHomePage : "")
          }
        >
          {text}
        </Text>
      </Link>
    </UnstyledButton>
  );
}
