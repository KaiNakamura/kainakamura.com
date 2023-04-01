import { Box, Container, Text, Title } from "@mantine/core";
import useStyles from "@styles/styles";

export default function Home() {
  const { classes } = useStyles();

  return (
    <Box sx={() => ({ backgroundColor: "#2A2C2D" }) }>
      <Container size="md" p="xl">
        <Title className={classes.title}>
          Hi, I'm{" "}
          <Text inherit variant="gradient" component="span">
            Kai
          </Text>
        </Title>
        <Title className={classes.subTitle} color="dimmed">
          Software Dev / Student
        </Title>
      </Container>
    </Box>
  );
}
