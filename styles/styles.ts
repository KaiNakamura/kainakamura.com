import { createStyles } from "@mantine/core";

export default createStyles((theme) => ({
  title: {
    color: "#EEEEEE",
    fontSize: 100,
    fontWeight: 900,
    letterSpacing: -2,

    [theme.fn.smallerThan("md")]: {
      fontSize: 60,
    },
    [theme.fn.smallerThan("sm")]: {
      fontSize: 40,
    },
  },
  subTitle: {
    color: "#379DC2",
    fontSize: 50,
    fontWeight: 400,
    letterSpacing: 2,

    [theme.fn.smallerThan("md")]: {
      fontSize: 30,
    },
    [theme.fn.smallerThan("sm")]: {
      fontSize: 20,
    },
  },
  navButton: {
    color: "#EEEEEE",
    fontSize: 20,
    fontWeight: 400,
    ":hover": {
      textDecoration: "underline",
    },
  },
  navButtonActive: {
    color: "#C93954",
    fontWeight: 700,
  },
  navButtonHomePage: {
    fontWeight: 700,
  },
}));
