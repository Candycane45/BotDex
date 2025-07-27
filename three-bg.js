// three-bg.js
const canvas = document.getElementById("bgCanvas");
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Create Scene and Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

// Add a few floating glowing spheres
const geometry = new THREE.SphereGeometry(0.3, 32, 32);
const material = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x008888 });
const lights = [];

for (let i = 0; i < 30; i++) {
  const sphere = new THREE.Mesh(geometry, material.clone());
  sphere.position.set(
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 6,
    (Math.random() - 0.5) * 10
  );
  scene.add(sphere);
  lights.push({ mesh: sphere, speed: Math.random() * 0.002 + 0.001 });
}

// Soft ambient light
const ambient = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambient);

// Animate
function animate(time) {
  requestAnimationFrame(animate);
  lights.forEach((light, index) => {
    light.mesh.position.y += Math.sin(time * light.speed + index) * 0.002;
  });
  renderer.render(scene, camera);
}

animate(0);

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
