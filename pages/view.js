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
import { cards } from "../cards";
import Image from "next/image";
import qr from "../images/qr.png";
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
    // if (showCards)
    //   return (
    //     <Avatar
    //       className={classes.shown}
    //       style={{
    //         backgroundColor:
    //           cards.find((c) => c.value === card)?.color ?? "gray",
    //       }}
    //     >
    //       {card}
    //     </Avatar>
    //   );
    // return card ? (
    //   <Avatar className={classes.ready}>
    //     <ThumbUp />
    //   </Avatar>
    // ) : (
    //   <Avatar>
    //     <Help />
    //   </Avatar>
    // );
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
      </figure>
    </main>
  );
}
