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
      Name:{" "}
      <input
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <button disabled={!name.trim()} onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}
