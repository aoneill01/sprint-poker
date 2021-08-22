import { Button } from "@material-ui/core";
import useWebSocket from "../hooks/useWebsocket";

export default function Home() {
  const { kickAll } = useWebSocket();

  return (
    <main>
      <Button onClick={kickAll}>Kick All</Button>
    </main>
  );
}
