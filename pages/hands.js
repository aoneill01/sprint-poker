import {
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { Help, ThumbUp } from "@material-ui/icons";
import { useState } from "react";
import useTimer from "../hooks/useTimer";
import useWebSocket from "../hooks/useWebsocket";

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
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

export default function Hands() {
  const { hands, reset } = useWebSocket();
  const [start, setStart] = useState(new Date());
  const time = useTimer(start);
  const showCards = hands?.every(({ card }) => card !== null);
  const classes = useStyles();

  const getAvatar = (card) => {
    if (showCards) return <Avatar className={classes.shown}>{card}</Avatar>;
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
    <main>
      <div className={classes.top}>
        <Button variant="outlined" onClick={handleReset}>
          Reset
        </Button>
        <Typography>{time}</Typography>
      </div>
      <List>
        {hands?.map(({ name, card }) => (
          <ListItem key={name}>
            <ListItemAvatar>{getAvatar(card)}</ListItemAvatar>
            <ListItemText>{name}</ListItemText>
          </ListItem>
        ))}
      </List>
    </main>
  );
}
