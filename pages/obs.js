import { makeStyles, Typography } from "@material-ui/core";
import useWebSocket from "../hooks/useWebSocket";
import AnimatedHand from "../components/animatedHand";

const useStyles = makeStyles(() => ({
  main: {},
  hands: {
    display: "grid",
    gridTemplateColumns: "550px 1fr 550px",
    gridTemplateRows: "repeat(3, 1fr)",
    height: "100%",
  },
  personContainer: {
    margin: "0 auto",
  },
  name: {
    color: "white",
    opacity: 0.7,
    marginTop: -20,
    textAlign: "center",
  },
  middle: {
    gridArea: "2 / 2 / 4 / 3",
    alignSelf: "end",
    marginBottom: 48,
  },
}));

export default function Hands() {
  const { hands } = useWebSocket();
  const showCards = hands?.every(({ card }) => card !== null);
  const classes = useStyles();

  return (
    <main className={classes.main}>
      <div className={classes.hands}>
        {hands
          ?.sort((handA, handB) => handA.name.localeCompare(handB.name))
          .map(({ name, card }) => (
            <div key={name} className={classes.personContainer}>
              <AnimatedHand
                cardValue={card}
                showCards={showCards}
                scale={2.75}
              />
              <Typography className={classes.name} variant="h5" component="div">
                {name}
              </Typography>
            </div>
          ))}
        <div className={classes.middle}>
          {" "}
          <svg viewBox="0 0 900 500" xmlns="http://www.w3.org/2000/svg">
            <polyline
              fill="#ad1f66"
              points="250,0 900,0 900,250 650,500 0,500 0,250"
            />
          </svg>
        </div>
      </div>
    </main>
  );
}
