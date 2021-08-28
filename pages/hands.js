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

const useStyles = makeStyles((theme) => ({
  top: {
    display: "flex",
    alignItems: "baseline",
    margin: theme.spacing(1),
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
  },
}));

export default function Hands() {
  const { hands, reset, kick } = useWebSocket();
  const [start, setStart] = useState(new Date());
  const time = useTimer(start);
  const showCards = hands?.every(({ card }) => card !== null);
  const classes = useStyles();

  const getAvatar = (card) => {
    if (showCards)
      return (
        <Avatar
          className={classes.shown}
          style={{
            backgroundColor:
              cards.find((c) => c.value === card)?.color ?? "gray",
          }}
        >
          {card}
        </Avatar>
      );
    return card ? (
      <Avatar className={classes.ready}>
        <ThumbUp />
      </Avatar>
    ) : (
      <Avatar>
        <Help />
      </Avatar>
    );
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
      <List>
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
    </main>
  );
}
