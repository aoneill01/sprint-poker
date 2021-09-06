import {
  Avatar,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { Delete, Help, ThumbUp } from "@material-ui/icons";
import { useState } from "react";
import useTimer from "../hooks/useTimer";
import useWebSocket from "../hooks/useWebSocket";
import Image from "next/image";
import qr from "../images/qr.png";
import card1 from "../images/card1.png";
import card2 from "../images/card2.png";
import card3 from "../images/card3.png";
import card5 from "../images/card5.png";
import card8 from "../images/card8.png";
import card13 from "../images/card13.png";
import card21 from "../images/card21.png";
import AnimatedHand from "../components/animatedHand";

const useStyles = makeStyles((theme) => ({
  top: {
    display: "flex",
    alignItems: "baseline",
    padding: theme.spacing(1),
    gap: theme.spacing(2),
  },
  ready: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
  },
  shown: {
    color: "white",
  },
  main: {
    maxWidth: theme.spacing(50),
    display: "flex",
    flexDirection: "column",
  },
  list: {
    flex: 1,
  },
  figure: {
    margin: 0,
    paddingBottom: theme.spacing(1),
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

  const getAvatar = (card) => {
    return <AnimatedHand cardValue={card} showCards={showCards} />;
  };

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
      <List className={classes.list}>
        {hands
          ?.sort((handA, handB) => handA.name.localeCompare(handB.name))
          .map(({ name, card }) => (
            <ListItem key={name}>
              <ListItemAvatar>{getAvatar(card)}</ListItemAvatar>
              <ListItemText>{name}</ListItemText>
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="kick"
                  onClick={() => kick(name)}
                >
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
      </List>
      <figure className={classes.figure}>
        <Image src={qr} alt="http://sprint.do.aoneill.com" />
        <Typography component="figcaption">
          Join at{" "}
          <a href="http://sprint.do.aoneill.com">
            http://sprint.do.aoneill.com
          </a>
        </Typography>
        <Image src={card1} />
        <Image src={card2} />
        <Image src={card3} />
        <Image src={card5} />
        <Image src={card8} />
        <Image src={card13} />
        <Image src={card21} />
      </figure>
    </main>
  );
}
