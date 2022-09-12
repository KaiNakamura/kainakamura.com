import { Container, Text, Title } from "@mantine/core";
import useStyles from "@styles/styles";

export default function Home() {
	const { classes } = useStyles();

	return (
		<Container>
			<Title className={classes.title}>
				Hi, I'm{' '}
				<Text inherit variant="gradient" component="span">
					Kai
				</Text>
			</Title>
			<Title className={classes.subTitle} color="dimmed">
				Software Dev / Student
			</Title>
		</Container>
	);
}
