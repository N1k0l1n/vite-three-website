import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Create the scene
const scene = new THREE.Scene();

// Create the camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.setZ(30);

// Create the renderer and set its size
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Add a point light
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// Add an ambient light
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

// Add light helper and grid helper
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

// Create the geometry and material for the torus
const geometry = new THREE.TorusGeometry(14, 1, 16, 100);
const material = new THREE.MeshBasicMaterial({
  color: 0xff6348,
});
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

// Function to add stars
function addStar() {
  const starGeometry = new THREE.SphereGeometry(0.25);
  const starMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(starGeometry, starMaterial);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

// Add multiple stars
Array(200).fill().forEach(addStar);

// Load and set the background texture
const spaceTexture = new THREE.TextureLoader().load("space.jpg");
scene.background = spaceTexture;

// Handle window resize
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Avatar
const loader = new GLTFLoader();
loader.load("./avatar.glb", (gltf) => {
  const avatar = gltf.scene;

  // Scale the avatar model
  avatar.scale.set(0.2, 0.2, 0.2); // Adjust scale to desired size

  // Change color of the avatar materials
  avatar.traverse((child) => {
    if (child.isMesh) {
      child.material.color.set(0x333333); // Change color to red
    }
  });

  // Rotate the avatar to make it stand upright
  // Rotate around X-axis by 90 degrees (π/2 radians) to flip the model
  avatar.rotation.x = -Math.PI / 2;
  avatar.rotation.y = -Math.PI;

  // Position the avatar
  avatar.position.set(0, 0, 0); // Adjust position as needed

  scene.add(avatar);
});

// Moon
const moonTexture = new THREE.TextureLoader().load("moon.jpg");

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 80, 80),
  new THREE.MeshStandardMaterial({ map: moonTexture })
);
moon.position.set(-10, 0, 0); // Position moon away from the origin

scene.add(moon);

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate the torus
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  // Render the scene from the perspective of the camera
  renderer.render(scene, camera);
}

// Start the animation loop
animate();
