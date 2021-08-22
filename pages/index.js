import Head from "next/head";
import { useState } from "react";
import Hand from "../components/hand";
import Name from "../components/name";
import useWebSocket from "../hooks/useWebsocket";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [name, setName] = useState(null);
  const { myCard, pickCard } = useWebSocket(name);

  return (
    <main className={styles.main}>
      {!name && <Name onSubmit={setName} />}
      {name && <Hand card={myCard} onSelection={pickCard} />}
    </main>
  );
}
