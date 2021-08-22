import { Button } from "@material-ui/core";

export default function Hand({ card, onSelection }) {
  const values = [1, 2, 3, 5, 8, 13, 21];
  const createSelectionHandler = (value) => () =>
    onSelection(value === card ? null : value);

  return (
    <div>
      {values.map((value) => (
        <Button
          key={value}
          onClick={createSelectionHandler(value)}
          style={{
            backgroundColor: value === card ? "lightblue" : "transparent",
          }}
        >
          {value}
        </Button>
      ))}
    </div>
  );
}
