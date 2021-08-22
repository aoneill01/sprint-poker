import { Button, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(1),
  },
}));

export default function Hand({ card, onSelection }) {
  const values = [1, 2, 3, 5, 8, 13, 21];
  const classes = useStyles();
  const createSelectionHandler = (value) => () =>
    onSelection(value === card ? null : value);

  return (
    <div className={classes.container}>
      {values.map((value) => (
        <Button
          key={value}
          onClick={createSelectionHandler(value)}
          size="large"
          variant="contained"
          color={card === value ? "primary" : "default"}
        >
          {value}
        </Button>
      ))}
    </div>
  );
}
