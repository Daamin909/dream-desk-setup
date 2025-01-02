import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

import wood from "./assets/wood.jpg";
import keyboardImage from "./assets/keyboard.png";
import appleImage from "./assets/apple.png";
import monitorImage from "./assets/screen.jpeg";
import woodTextureImage from "./assets/tabletexture.jpeg";

const App = () => {
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    // controls for the camera
    // ! this makes the controls smooth
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2;

    // room dimensions
    const width = 12;
    const height = 12;
    const depth = 12;
    const floorG = new THREE.PlaneGeometry(width, depth);
    const floorM = new THREE.MeshStandardMaterial({
      color: 0x818589,
      side: 2,
    });
    const floor = new THREE.Mesh(floorG, floorM);
    floor.rotation.x = Math.PI / 2;
    const roofG = new THREE.PlaneGeometry(width, depth);
    const roofM = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      side: 2,
    });
    const roof = new THREE.Mesh(roofG, roofM);
    roof.rotation.x = Math.PI / 2;

    const woodTexture = new THREE.TextureLoader().load(wood);
    woodTexture.wrapS = THREE.RepeatWrapping;
    woodTexture.wrapT = THREE.RepeatWrapping;
    woodTexture.repeat.set(2, 2);
    const wallMaterial = new THREE.MeshStandardMaterial({ map: woodTexture });
    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      wallMaterial
    );
    const frontWall = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      wallMaterial
    );
    const rightWall = new THREE.Mesh(
      new THREE.PlaneGeometry(depth, height),
      wallMaterial
    );
    const leftWall = new THREE.Mesh(
      new THREE.PlaneGeometry(depth, height),
      wallMaterial
    );
    // rotating the walls
    leftWall.rotation.y = -Math.PI / 2;
    rightWall.rotation.y = Math.PI / 2;

    const dWidth = 5;
    const dDepth = 2;
    const dHeight = 0.05;
    const boundaryThickness = 0.1;
    const boundaryHeight = 0.15;
    const deskG = new THREE.BoxGeometry(
      dWidth + boundaryThickness * 2,
      dHeight,
      dDepth + boundaryThickness * 2
    );
    const deskTexture = new THREE.TextureLoader().load(woodTextureImage);
    const deskM = new THREE.MeshStandardMaterial({
      map: deskTexture,
      color: 0xdddddd,
    });
    const desk = new THREE.Mesh(deskG, deskM);

    const borderMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });

    const frontFrame = new THREE.Mesh(
      new THREE.BoxGeometry(
        dWidth + boundaryThickness * 2,
        boundaryHeight,
        boundaryThickness
      ),
      borderMaterial
    );
    const backFrame = new THREE.Mesh(
      new THREE.BoxGeometry(
        dWidth + boundaryThickness * 2,
        boundaryHeight,
        boundaryThickness
      ),
      borderMaterial
    );
    const leftFrame = new THREE.Mesh(
      new THREE.BoxGeometry(
        boundaryThickness,
        boundaryHeight,
        dDepth + boundaryThickness * 2
      ),
      borderMaterial
    );
    const rightFrame = new THREE.Mesh(
      new THREE.BoxGeometry(
        boundaryThickness,
        boundaryHeight,
        dDepth + boundaryThickness * 2
      ),
      borderMaterial
    );

    backFrame.position.set(
      0,
      -boundaryHeight / 2,
      -dDepth / 2 - boundaryThickness / 2
    );
    frontFrame.position.set(
      0,
      -boundaryHeight / 2,
      dDepth / 2 + boundaryThickness / 2
    );
    leftFrame.position.set(
      -dWidth / 2 - boundaryThickness / 2,
      -boundaryHeight / 2,
      0
    );
    rightFrame.position.set(
      dWidth / 2 + boundaryThickness / 2,
      -boundaryHeight / 2,
      0
    );
    desk.add(frontFrame);
    desk.add(backFrame);
    desk.add(leftFrame);
    desk.add(rightFrame);

    roof.position.set(0, height - 1, 0);
    floor.position.set(0, -1, 0);
    backWall.position.set(0, height / 2 - 1, -depth / 2);
    frontWall.position.set(0, height / 2 - 1, depth / 2);
    rightWall.position.set(width / 2, height / 2 - 1, 0);
    leftWall.position.set(-width / 2, height / 2 - 1, 0);
    desk.position.set(0, 0, -2);

    const monitorW = 2;
    const monitorH = 1;
    const monitorD = 0.05;
    const bezels = 0.02;

    const bezelG = new THREE.BoxGeometry(
      monitorW + bezels * 2,
      monitorH + bezels * 2,
      monitorD
    );
    const bezelM = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const monitorBezel = new THREE.Mesh(bezelG, bezelM);
    monitorBezel.position.set(0, 0.6, -2.3);
    const screenTexture = new THREE.TextureLoader().load(monitorImage);
    const screenG = new THREE.PlaneGeometry(monitorW, monitorH);
    const screenMs = new THREE.MeshStandardMaterial({
      map: screenTexture,
      emissive: 0xffffff,
      emissiveIntensity: 0.2,
    });
    const screen = new THREE.Mesh(screenG, screenMs);
    screen.position.set(0, 0, monitorD / 2 + 0.001);
    monitorBezel.add(screen);

    const standG = new THREE.BoxGeometry(0.3, 0.02, 0.2);
    const standM = new THREE.MeshStandardMaterial({
      color: 0x808080,
    });
    const stand = new THREE.Mesh(standG, standM);
    stand.position.set(0, 0.01, -2.3);
    const rodG = new THREE.BoxGeometry(0.05, 0.6, 0.05);
    const rod = new THREE.Mesh(rodG, standM);
    rod.position.set(0, 0.3, 0);
    stand.add(rod);

    const mabrookM = new THREE.MeshStandardMaterial({
      color: 0xc0c0c0,
    });
    // const mabrookG = new THREE.BoxGeometry(0.8, 0.02, 0.5);
    const mabrookG = new RoundedBoxGeometry(0.8, 0.02, 0.5, 16, 100);
    const mabrook = new THREE.Mesh(mabrookG, mabrookM);
    mabrook.position.set(0, 0.03, -1.8);

    const apeelTexture = new THREE.TextureLoader().load(appleImage);
    const apeelM = new THREE.MeshStandardMaterial({
      map: apeelTexture,
      transparent: true,
    });
    const apeelG = new THREE.BoxGeometry(0.1, 0.1, 0.00001);
    const apeelMesh = new THREE.Mesh(apeelG, apeelM);
    apeelMesh.position.set(0, 0.04, -1.8);
    apeelMesh.rotation.x = Math.PI / 2;
    apeelMesh.rotation.z = Math.PI;

    const backplateMat = new THREE.MeshStandardMaterial({
      color: 0x000000,
    });
    const backplateGeo = new THREE.BoxGeometry(0.7, 0.01, 0.25);
    const backplate = new THREE.Mesh(backplateGeo, backplateMat);
    backplate.position.set(0, 0.02, -1.2);
    const keyboardTexture = new THREE.TextureLoader().load(keyboardImage);
    const keyboardMaterial = new THREE.MeshStandardMaterial({
      map: keyboardTexture,
      transparent: true,
    });
    const keyboardGeometry = new THREE.BoxGeometry(0.7, 0.02, 0.25);
    const keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterial);
    keyboard.position.set(0, 0.03, -1.2);
    scene.add(keyboard);

    const rClickG = new THREE.BoxGeometry(0.05, 0.05, 0.1);
    const rClickM = new THREE.MeshStandardMaterial({ color: 0x696969 });
    const rClick = new THREE.Mesh(rClickG, rClickM);
    const lClickG = new THREE.BoxGeometry(0.05, 0.05, 0.1);
    const lClickM = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const lClick = new THREE.Mesh(lClickG, lClickM);

    const mouseG = new THREE.BoxGeometry(0.1, 0.1, 0.18);
    const mouseM = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const mouse = new THREE.Mesh(mouseG, mouseM);

    rClick.position.set(0.78, 0.06, -1.65);
    lClick.position.set(0.82, 0.06, -1.65);
    mouse.position.set(0.8, 0.02, -1.6);
    scene.add(mouse);
    scene.add(lClick);
    scene.add(rClick);

    // a group is a new dimension
    // has relative coords to it
    const chairGroup = new THREE.Group();
    const seatG = new THREE.BoxGeometry(0.8, 0.1, 0.8);
    const chairM = new THREE.MeshStandardMaterial({ color: 0x2221222 });
    const seat = new THREE.Mesh(seatG, chairM);
    seat.position.y = -0.2;
    chairGroup.add(seat);
    const backG = new THREE.BoxGeometry(0.8, 0.8, 0.1);
    const back = new THREE.Mesh(backG, chairM);
    back.position.set(0, 0.2, 0.35);
    chairGroup.add(back);
    const bottomG = new THREE.CylinderGeometry(0.4, 0.4, 0.05, 32);
    const bottom = new THREE.Mesh(bottomG, chairM);
    bottom.position.y = -1;
    chairGroup.add(bottom);
    const poleg = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 16);
    const pole = new THREE.Mesh(poleg, chairM);
    pole.position.y = -1;
    chairGroup.add(pole);
    chairGroup.position.set(0, 0, 0);
    scene.add(chairGroup);

    const legG = new THREE.CylinderGeometry(0.05, 0.05, 2);
    const legM = new THREE.MeshStandardMaterial({ color: 0x4b4b4b });
    // dwidth is 5 and ddepth is 2
    const coords = [
      [-2.3, -1, -2.8],
      [2.3, -1, -2.8],
      [-2.3, -1, -1.2],
      [2.3, -1, -1.2],
    ];
    coords.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legG, legM);
      leg.position.set(x, y, z);
      scene.add(leg);
    });

    const speakerG = new THREE.BoxGeometry(0.5, 0.8, 0.5);
    const speakerM = new THREE.MeshPhongMaterial({
      color: 0x202020,
      specular: 0x404040,
      shininess: 30,
    });
    const speaker = new THREE.Mesh(speakerG, speakerM);
    const circleG = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 32222);
    const circleM = new THREE.MeshPhongMaterial({
      color: 0x303030,
      specular: 0x505050,
      shininess: 50,
    });
    const circle = new THREE.Mesh(circleG, circleM);
    circle.rotation.x = Math.PI / 2;
    circle.position.z = 0.21;
    const domeG = new THREE.SphereGeometry(0.1, 32, 32);
    const domeM = new THREE.MeshPhongMaterial({
      color: 0x707070,
      specular: 0x909090,
      shininess: 70,
    });
    const dome = new THREE.Mesh(domeG, domeM);
    dome.position.z = 0.2;
    const speakerGroup = new THREE.Group();
    speakerGroup.add(speaker);
    speakerGroup.add(circle);
    speakerGroup.add(dome);
    speakerGroup.position.set(1.6, 0.4, -2);
    const speakerGroup2 = speakerGroup.clone();
    speakerGroup2.position.set(-1.6, 0.4, -2);

    scene.add(speakerGroup2);
    scene.add(speakerGroup);
    scene.add(floor);
    scene.add(roof);
    scene.add(backWall);
    scene.add(frontWall);
    scene.add(rightWall);
    scene.add(leftWall);
    scene.add(desk);
    scene.add(monitorBezel);
    scene.add(stand);
    scene.add(mabrook);
    scene.add(apeelMesh);
    scene.add(backplate); // this is keyboard's backpate
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(5, 5, 5);
    scene.add(mainLight);
    camera.position.set(0, 3, 2);
    camera.lookAt(0, 0, -2);
    window.addEventListener("resize", () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();
  }, []);
  return <></>;
};

export default App;
