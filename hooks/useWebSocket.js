import { useCallback, useEffect, useRef, useState } from "react";

export default function useWebSocket(name) {
  const [hands, setHands] = useState(null);
  const ws = useRef(null);
  const nameRef = useRef(null);
  const myCard = hands?.find((hand) => hand.name === name)?.card;

  nameRef.current = name;

  const pickCard = useCallback((card) => {
    if (ws.current?.readyState !== 1) {
      console.error("WebSocket not connected.");
      return;
    }
    if (!nameRef.current) return;

    ws.current.send(JSON.stringify({ name: nameRef.current, card }));
  }, []);

  useEffect(() => {
    if (ws.current?.readyState === 1) pickCard(undefined);
  }, [pickCard, name]);

  useEffect(() => {
    let reconnect = true;

    const init = (reconnectDelay = 500) => {
      ws.current = new WebSocket(`ws://${location.host}/test`);
      ws.current.addEventListener("message", (event) => {
        setHands(JSON.parse(event.data));
      });
      ws.current.addEventListener("open", () => {
        reconnectDelay = 500;
        pickCard(undefined);
      });
      ws.current.addEventListener("close", () => {
        reconnect && setTimeout(init, reconnectDelay, reconnectDelay * 2);
      });
    };

    init();

    return () => {
      reconnect = false;
      ws.current?.close();
    };
  }, [pickCard]);

  return { hands, myCard, pickCard };
}
