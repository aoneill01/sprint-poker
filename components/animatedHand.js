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
import cardFront from "../images/card-front.png";

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
  width = 200;
  height = 125;
  materialBack = new MeshStandardMaterial({
    map: ThreeHand.loader.load(cardBack.src),
    side: BackSide,
    roughness: 0.4,
  });
  materialFront = new MeshStandardMaterial({
    map: ThreeHand.loader.load(cardFront.src),
    side: FrontSide,
    roughness: 0.4,
  });

  constructor(element) {
    this.element = element;

    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.width, this.height);
    this.element.appendChild(this.renderer.domElement);

    const light = new PointLight(0xffffff, 0.5);
    light.position.set(1, 1, 2);

    this.camera = new PerspectiveCamera(
      75,
      this.width / this.height,
      0.1,
      1000
    );
    this.camera.position.z = 2.2;

    const card = this.createCard();
    card.position.z = -0.2;

    this.scene = new Scene();
    this.scene.add(light);
    this.scene.add(new AmbientLight(0xffffff, 0.3));
    this.scene.add(this.camera);
    this.scene.add(card);
    this.scene.background = new Color(0x111111);

    const animate = (timestamp) => {
      requestAnimationFrame(animate);
      this.renderer.render(this.scene, this.camera);
      card.rotation.y += 0.1;
    };
    requestAnimationFrame(animate);
  }

  update(cardValue, showCards) {
    // if (showCards) {
    //   this.element.textContent = cardValue;
    // } else {
    //   this.element.textContent = cardValue ? "+" : "?";
    // }
  }

  createCard() {
    const back = new Mesh(ThreeHand.cardGeometry, this.materialBack);
    const front = new Mesh(ThreeHand.cardGeometry, this.materialFront);
    const group = new Group();
    group.add(back);
    group.add(front);
    return group;
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
}
