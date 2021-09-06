import { Button, IconButton, makeStyles, Typography } from "@material-ui/core";
import { useState } from "react";
import useTimer from "../hooks/useTimer";
import useWebSocket from "../hooks/useWebSocket";
import Image from "next/image";
import qr from "../images/qr.png";
import AnimatedHand from "../components/animatedHand";
import { Close } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  top: {
    display: "flex",
    alignItems: "baseline",
    padding: theme.spacing(1),
    gap: theme.spacing(2),
    backgroundColor: "#fff",
  },
  ready: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
  },
  main: {
    maxWidth: 212,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "black",
  },
  hands: {
    flex: 1,
  },
  personContainer: {
    position: "relative",
    border: "2px solid #333",
    margin: 4,
  },
  name: {
    position: "absolute",
    bottom: 0,
    left: 4,
    color: "white",
    opacity: 0.7,
    fontWeight: "bold",
  },
  delete: {
    position: "absolute",
    top: 0,
    right: 0,
    color: "white",
    opacity: 0.2,
  },
  figure: {
    margin: 0,
    color: "white",
    paddingBottom: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "& figcaption": {
      fontSize: 12,
      marginLeft: theme.spacing(1),
    },
  },
}));

export default function Hands() {
  const { hands, reset, kick } = useWebSocket();
  const [start, setStart] = useState(new Date());
  const time = useTimer(start);
  const showCards = hands?.every(({ card }) => card !== null);
  const classes = useStyles();

  const handleReset = () => {
    setStart(new Date());
    reset();
  };

  return (
    <main className={classes.main}>
      <div className={classes.top}>
        <Button variant="outlined" onClick={handleReset}>
          Reset
        </Button>
        <Typography>{time}</Typography>
      </div>
      <div className={classes.hands}>
        {hands
          ?.sort((handA, handB) => handA.name.localeCompare(handB.name))
          .map(({ name, card }) => (
            <div key={name} className={classes.personContainer}>
              <AnimatedHand cardValue={card} showCards={showCards} />
              <Typography className={classes.name}>{name}</Typography>
              <IconButton
                aria-label="delete"
                className={classes.delete}
                size="small"
                onClick={() => kick(name)}
              >
                <Close />
              </IconButton>
            </div>
          ))}
      </div>
      <figure className={classes.figure}>
        <Image
          className={classes.qr}
          src={qr}
          alt="http://sprint.do.aoneill.com"
        />
        <Typography component="figcaption">
          Join at{" "}
          <a href="http://sprint.do.aoneill.com">
            http://sprint.do.aoneill.com
          </a>
        </Typography>
      </figure>
    </main>
  );
}
