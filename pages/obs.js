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
  cutout: {
    animation: "$cutoutBackground 60s",
    animationIterationCount: "infinite",
    animationDirection: "alternate",
  },
  "@keyframes cutoutBackground": {
    "0%": {
      fill: "#ad1f66",
    },
    "17%": {
      fill: "#b92f43",
    },
    "33%": {
      fill: "#b44c23",
    },
    "50%": {
      fill: "#a26700",
    },
    "67%": {
      fill: "#857f00",
    },
    "83%": {
      fill: "#5f9229",
    },
    "100%": {
      fill: "#12a159",
    },
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
          <svg viewBox="0 0 900 500" xmlns="http://www.w3.org/2000/svg">
            <polyline
              className={classes.cutout}
              points="250,0 900,0 900,250 650,500 0,500 0,250"
            />
          </svg>
        </div>
      </div>
    </main>
  );
}
