import { Button, makeStyles } from "@material-ui/core";
import { cards } from "../cards";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(1),
    justifyContent: "center",
  },
  cardButton: {
    height: theme.spacing(20),
    width: theme.spacing(12),
    fontSize: 36,
  },
}));

export default function Hand({ cardValue, onSelection }) {
  const classes = useStyles();
  const createSelectionHandler = (value) => () =>
    onSelection(value === cardValue ? null : value);

  return (
    <div className={classes.container}>
      {cards.map((card) => (
        <CardButton
          key={card.value}
          card={card}
          onSelection={createSelectionHandler(card.value)}
          isSelected={card.value === cardValue}
          hasSelection={!!cardValue}
        />
      ))}
    </div>
  );
}

function CardButton({ card, onSelection, isSelected, hasSelection }) {
  const classes = useStyles();
  return (
    <Button
      onClick={onSelection}
      variant="contained"
      style={{
        backgroundColor: !hasSelection || isSelected ? card.color : "gray",
        color: "white",
      }}
      className={classes.cardButton}
    >
      {card.value}
    </Button>
  );
}
