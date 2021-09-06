import chroma from "chroma-js";
import card1 from "./images/card1.png";
import card2 from "./images/card2.png";
import card3 from "./images/card3.png";
import card5 from "./images/card5.png";
import card8 from "./images/card8.png";
import card13 from "./images/card13.png";
import card21 from "./images/card21.png";

const getColor = (distance) => {
  return chroma.mix(
    "hsl(150, 80%, 35%)",
    "hsl(330, 70%, 40%)",
    distance,
    "lch"
  );
};

export const cards = [
  {
    value: 1,
    color: getColor(0 / 6),
    image: card1,
  },
  {
    value: 2,
    color: getColor(1 / 6),
    image: card2,
  },
  {
    value: 3,
    color: getColor(2 / 6),
    image: card3,
  },
  {
    value: 5,
    color: getColor(3 / 6),
    image: card5,
  },
  {
    value: 8,
    color: getColor(4 / 6),
    image: card8,
  },
  {
    value: 13,
    color: getColor(5 / 6),
    image: card13,
  },
  {
    value: 21,
    color: getColor(6 / 6),
    image: card21,
  },
];
