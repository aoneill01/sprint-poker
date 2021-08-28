import { Container, makeStyles } from "@material-ui/core";
import { useState } from "react";
import Hand from "../components/hand";
import Name from "../components/name";
import useWebSocket from "../hooks/useWebSocket";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
  },
}));

export default function Home() {
  const [name, setName] = useState(null);
  const { myCard, pickCard } = useWebSocket(name);
  const classes = useStyles();

  return (
    <Container maxWidth="sm" className={classes.container}>
      <main>
        {!name && <Name onSubmit={setName} />}
        {name && <Hand card={myCard} onSelection={pickCard} />}
      </main>
    </Container>
  );
}
