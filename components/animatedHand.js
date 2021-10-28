import { useEffect, useRef } from "react";
import {
  AmbientLight,
  BackSide,
  BufferAttribute,
  Color,
  FrontSide,
  Group,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  Shape,
  ShapeGeometry,
  TextureLoader,
  Vector2,
  WebGLRenderer,
} from "three";
import cardBack from "../images/card-back.png";
import card1 from "../images/card1.png";
import card2 from "../images/card2.png";
import card3 from "../images/card3.png";
import card5 from "../images/card5.png";
import card8 from "../images/card8.png";
import card13 from "../images/card13.png";
import card21 from "../images/card21.png";

const cardImages = [
  { value: null, image: card1 },
  { value: 1, image: card1 },
  { value: 2, image: card2 },
  { value: 3, image: card3 },
  { value: 5, image: card5 },
  { value: 8, image: card8 },
  { value: 13, image: card13 },
  { value: 21, image: card21 },
];

export default function AnimatedHand({ cardValue, showCards }) {
  const myTest = useRef(null);
  const myDiv = useRef(null);
  useEffect(() => {
    if (myTest.current === null) myTest.current = new ThreeHand(myDiv.current);
    myTest.current.update(cardValue, showCards);
  }, [cardValue, showCards]);
  return <div ref={myDiv}></div>;
}

class ThreeHand {
  static loader = new TextureLoader();
  static cardGeometry = ThreeHand.createCardGeometry();

  materialBack = new MeshStandardMaterial({
    map: ThreeHand.loader.load(cardBack.src),
    side: BackSide,
    roughness: 0.4,
  });
  materialFrontMap = cardImages.reduce(
    (acc, { value, image }) => ({
      ...acc,
      [value]: new MeshStandardMaterial({
        map: ThreeHand.loader.load(image.src),
        side: FrontSide,
        roughness: 0.4,
      }),
    }),
    {}
  );

  constructor(element) {
    this.state = "thinking";

    const width = 200;
    const height = 125;

    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    element.appendChild(renderer.domElement);

    const light = new PointLight(0xffffff, 0.5);
    light.position.set(1, 1, 2);

    const camera = new PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.z = 2.2;

    this.hand = this.createHand();
    this.hand.object.position.z = -0.5;

    const scene = new Scene();
    scene.add(light);
    scene.add(new AmbientLight(0xffffff, 0.5));
    scene.add(camera);
    scene.add(this.hand.object);
    scene.background = new Color(0x111111);

    const animate = (timestamp) => {
      this.hand.update(timestamp);
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    requestAnimationFrame(animate);
  }

  update(cardValue, showCards) {
    if (this.cardValue !== cardValue && cardValue !== null) {
      this.hand.cards.forEach(
        (card) => (card.children[1].material = this.materialFrontMap[cardValue])
      );
    }

    if (showCards) {
      if (!this.showTimerId) {
        this.showTimerId = setTimeout(() => {
          this.state = "animateReveal";
          this.animateStart = null;
          this.presentCard(1);
          this.raiseCard(1);
          this.stopJiggle(1);
        }, 3000);
      }
    } else {
      if (this.showTimerId) {
        clearTimeout(this.showTimerId);
        this.showTimerId = null;
      }
    }

    switch (this.state) {
      case "thinking":
        if (cardValue) {
          this.state = "animatePick";
          this.animateStart = null;
        }
        break;
      case "picked":
        if (!cardValue) {
          this.state = "animateUnpick";
          this.animateStart = null;
        }
      case "revealed":
        if (!showCards) {
          this.state = "animateUnreveal";
          this.animateStart = null;
        }
    }

    this.cardValue = cardValue;
    this.showCards = showCards;
  }

  createCard() {
    const back = new Mesh(ThreeHand.cardGeometry, this.materialBack);
    const front = new Mesh(ThreeHand.cardGeometry, this.materialFrontMap[1]);
    const group = new Group();
    group.add(back);
    group.add(front);
    return group;
  }

  createHand() {
    const group = new Group();
    const CARD_COUNT = 6;
    let cards = [];
    let cardGroups = [];
    for (let i = 0; i < CARD_COUNT; i++) {
      const cardGroup = new Group();
      const card = this.createCard();
      card.position.set(0, 5, i * 0.05);
      cardGroup.rotation.set(0, Math.PI, -0.1 * (i - (CARD_COUNT - 1) / 2));
      cardGroup.add(card);
      group.add(cardGroup);
      cards.push(card);
      cardGroups.push(cardGroup);
    }
    const result = new Group();
    group.position.y = -5;
    result.add(group);

    const update = (timestamp) => {
      if (!this.animateStart) this.animateStart = timestamp;

      switch (this.state) {
        case "thinking":
          cards.forEach((card, i) => {
            card.position.y = 5 + ThreeHand.getOffset(timestamp + 100 * i);
          });
          break;
        case "animatePick":
          this.animatePick(timestamp);
          break;
        case "animateUnpick":
          this.animateUnpick(timestamp);
          break;
        case "animateReveal":
          this.animateReveal(timestamp);
          break;
        case "revealed":
          this.flip(1);
          break;
        case "animateUnreveal":
          this.animateUnreveal(timestamp);
          break;
      }
    };

    const pick = () => {
      picked = true;
    };

    return { update, object: result, pick, cards, cardGroups };
  }

  animatePick(timestamp) {
    const delta = timestamp - this.animateStart;
    if (delta < 500) {
      this.stopJiggle(delta / 500, timestamp);
    } else if (delta < 1500) {
      this.raiseCard(clampT((delta - 500) / 1000));
    } else if (delta < 2500) {
      this.presentCard(clampT((delta - 1500) / 1000));
    } else {
      this.stopJiggle(1, timestamp);
      this.raiseCard(1);
      this.presentCard(1);
      this.animateStart = null;
      if (this.cardValue) this.state = "picked";
      else this.state = "animateUnpick";
    }
  }

  animateUnpick(timestamp) {
    const delta = timestamp - this.animateStart;
    if (delta < 500) {
      this.presentCard(1 - clampT(delta / 500));
    } else if (delta < 1000) {
      this.raiseCard(1 - clampT((delta - 500) / 500));
    } else if (delta < 1500) {
      this.stopJiggle(1 - clampT((delta - 1000) / 500), timestamp);
    } else {
      this.presentCard(0);
      this.raiseCard(0);
      this.stopJiggle(0, timestamp);
      this.animateStart = null;
      if (!this.cardValue) this.state = "thinking";
      else this.state = "animatePick";
    }
  }

  animateReveal(timestamp) {
    const delta = timestamp - this.animateStart;
    if (delta < 1000) {
      this.flip(clampT(delta / 1000));
    } else {
      this.animateStart = null;
      this.flip(1);
      this.state = "revealed";
    }
  }

  animateUnreveal(timestamp) {
    const delta = timestamp - this.animateStart;
    if (delta < 500) {
      this.flip(1 - clampT(delta / 500));
    } else {
      this.flip(0);
      this.animateStart = null;
      if (this.cardValue) this.state = "picked";
      else this.state = "animateUnpick";
    }
  }

  stopJiggle(t, timestamp) {
    const jiggleFactor = 1 - easeInOutQuad(t);
    this.hand.cards.forEach((card, i) => {
      card.position.y =
        5 + jiggleFactor * ThreeHand.getOffset(timestamp + 100 * i);
    });
  }

  raiseCard(t) {
    const eased = easeInOutQuad(t);
    this.hand.cards[3].position.y = 5 + 0.8 - 0.8 * Math.cos(eased * Math.PI);
  }

  presentCard(t) {
    const eased = easeInOutQuad(t);
    this.hand.cards[3].position.y =
      5 + 0.8 - 0.8 * Math.cos(eased * Math.PI + Math.PI);
    this.hand.cards[3].position.z = 3 * 0.05 - 1 * eased;
    this.hand.cardGroups.forEach((cardGroup, i) => {
      cardGroup.rotation.z =
        (1 - eased) * -0.1 * (i - (this.hand.cards.length - 1) / 2);
      if (i !== 3) {
        cardGroup.rotation.x = -(Math.PI / 2) * eased;
      }
    });
  }

  flip(t) {
    const eased = easeInOutQuad(t);
    this.hand.cards[3].rotation.y = eased * Math.PI;
  }

  static createCardGeometry() {
    const shape = ThreeHand.createRoundedRect(-0.5, -0.75, 1, 1.5, 0.08);
    const geometry = new ShapeGeometry(shape);

    // Calculate the UVs
    geometry.computeBoundingBox();

    const max = geometry.boundingBox.max;
    const min = geometry.boundingBox.min;
    const offset = new Vector2(0 - min.x, 0 - min.y);
    const range = new Vector2(max.x - min.x, max.y - min.y);
    const vertices = geometry.getAttribute("position");
    const uvs = [];

    for (let i = 0; i < vertices.count; i++) {
      const x = vertices.getX(i);
      const y = vertices.getY(i);

      uvs.push((x + offset.x) / range.x, (y + offset.y) / range.y);
    }
    geometry.setAttribute("uv", new BufferAttribute(new Float32Array(uvs), 2));
    geometry.uvsNeedUpdate = true;

    return geometry;
  }

  static createRoundedRect(x, y, width, height, radius) {
    const shape = new Shape();

    shape.moveTo(x, y + radius);
    shape.lineTo(x, y + height - radius);
    shape.quadraticCurveTo(x, y + height, x + radius, y + height);
    shape.lineTo(x + width - radius, y + height);
    shape.quadraticCurveTo(
      x + width,
      y + height,
      x + width,
      y + height - radius
    );
    shape.lineTo(x + width, y + radius);
    shape.quadraticCurveTo(x + width, y, x + width - radius, y);
    shape.lineTo(x + radius, y);
    shape.quadraticCurveTo(x, y, x, y + radius);

    return shape;
  }

  static getOffset(timestamp) {
    const t = timestamp % 1000;
    if (t < 500) {
      return 0.05 - 0.05 * Math.cos((t / 500) * 2 * Math.PI);
    }
    return 0;
  }
}

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function clampT(t) {
  if (t < 0) return 0;
  if (t > 1) return 1;
  return t;
}
