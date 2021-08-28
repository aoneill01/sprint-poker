import {
  blue,
  cyan,
  deepPurple,
  green,
  indigo,
  lightBlue,
  teal,
} from "@material-ui/core/colors";

const getColor = (distance) => {
  const start = 180;
  const end = 0;
  const hue = start + distance * (end - start);
  return `hsl(${hue}, 70%, 40%)`;
};

export const cards = [
  {
    value: 1,
    color: getColor(0 / 6),
  },
  {
    value: 2,
    color: getColor(1 / 6),
  },
  {
    value: 3,
    color: getColor(2 / 6),
  },
  {
    value: 5,
    color: getColor(3 / 6),
  },
  {
    value: 8,
    color: getColor(4 / 6),
  },
  {
    value: 13,
    color: getColor(5 / 6),
  },
  {
    value: 21,
    color: getColor(6 / 6),
  },
];
