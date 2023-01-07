import { Container, Title } from "@mantine/core";
import useStyles from "@styles/styles";

export default function Projects() {
  const { classes } = useStyles();

  return (
    <Container>
      <Title className={classes.title}>Contact</Title>
    </Container>
  );
}
