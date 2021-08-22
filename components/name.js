import {
  Button,
  Card,
  CardContent,
  CardActions,
  TextField,
  makeStyles,
} from "@material-ui/core";
import { useEffect, useState } from "react";

const useStyles = makeStyles(() => ({
  input: {
    width: "100%",
  },
}));

export default function Name({ onSubmit }) {
  const [name, setName] = useState("");
  const classes = useStyles();

  useEffect(() => {
    setName(localStorage.getItem("name") ?? "");
  }, []);

  const handleSubmit = () => {
    localStorage?.setItem("name", name.trim());
    onSubmit?.(name.trim());
  };

  return (
    <Card>
      <CardContent>
        <TextField
          className={classes.input}
          label="Name"
          variant="outlined"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </CardContent>
      <CardActions>
        <Button
          disabled={!name.trim()}
          onClick={handleSubmit}
          variant="contained"
          color="primary"
        >
          Submit
        </Button>
      </CardActions>
    </Card>
  );
}
