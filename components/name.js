import { Button, TextField } from "@material-ui/core";
import { useEffect, useState } from "react";

export default function Name({ onSubmit }) {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(localStorage.getItem("name") ?? "");
  }, []);

  const handleSubmit = () => {
    localStorage?.setItem("name", name.trim());
    onSubmit?.(name.trim());
  };

  return (
    <div>
      <TextField
        label="Name"
        variant="outlined"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <Button disabled={!name.trim()} onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
}
