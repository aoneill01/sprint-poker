import Head from "next/head";
import useWebSocket from "../hooks/useWebsocket";
import styles from "../styles/Home.module.css";

export default function Hands() {
  const { hands } = useWebSocket();
  const showCards = hands?.every(({ card }) => card !== null);
  const getCardLabel = (card) => {
    if (showCards) return card;
    return card ? "✅" : "🤔";
  };

  return (
    <main className={styles.main}>
      {hands?.map(({ name, card }) => (
        <div key={name}>
          {name}: {getCardLabel(card)}
        </div>
      ))}
    </main>
  );
}
