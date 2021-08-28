import { Button } from "@material-ui/core";
import useWebSocket from "../hooks/useWebSocket";

export default function Home() {
  const { kick } = useWebSocket();

  return (
    <main>
      <Button onClick={() => kick()}>Kick All</Button>
    </main>
  );
}
