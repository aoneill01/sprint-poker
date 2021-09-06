import { Button, makeStyles } from "@material-ui/core";
import { cards } from "../cards";
import Image from "next/image";

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
  cardImage: {
    borderRadius: 10,
    filter: "saturate(100%)",
    transition: "filter .5s",
    cursor: "pointer",
  },
  notSelected: {
    filter: "saturate(0%)",
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
    <Image
      onClick={onSelection}
      src={card.image}
      className={`${classes.cardImage} ${
        !isSelected && hasSelection ? classes.notSelected : ""
      }`}
      alt={card.value}
    />
  );
}
