import { createStyles } from "@mantine/core";

export default createStyles((theme) => ({
	title: {
		color: theme.colorScheme === "dark" ? theme.white : theme.black,
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
}));
