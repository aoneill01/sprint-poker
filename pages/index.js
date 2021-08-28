import { Container, makeStyles } from "@material-ui/core";
import { useState } from "react";
import Hand from "../components/hand";
import Name from "../components/name";
import useWebSocket from "../hooks/useWebSocket";

const useStyles = makeStyles((theme) => ({
  container: {
    margin: `${theme.spacing(2)}px auto`,
  },
}));

export default function Home() {
  const [name, setName] = useState(null);
  const { myCard, pickCard } = useWebSocket(name);
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <main>
        {!name && <Name onSubmit={setName} />}
        {name && <Hand cardValue={myCard} onSelection={pickCard} />}
      </main>
    </Container>
  );
}
