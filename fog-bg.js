// === Scene Setup ===
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("cyberCanvas"),
  alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

// === Fog Shader Material ===
const fogMaterial = new THREE.ShaderMaterial({
  uniforms: {
    iTime: { value: 0 },
    iResolution: { value: new THREE.Vector3(window.innerWidth, window.innerHeight, 1) },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `,
  fragmentShader: `
    precision mediump float;
    uniform float iTime;
    uniform vec3 iResolution;
    varying vec2 vUv;

    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123);
    }

    float smoothNoise(vec2 uv) {
      vec2 i = floor(uv);
      vec2 f = fract(uv);
      float a = noise(i), b = noise(i + vec2(1.0, 0.0));
      float c = noise(i + vec2(0.0, 1.0)), d = noise(i + vec2(1.0, 1.0));
      vec2 u = f*f*(3.0-2.0*f);
      return mix(a, b, u.x) + (c - a)*u.y*(1.0 - u.x) + (d - b)*u.x*u.y;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / iResolution.xy;
      float t = iTime * 0.05;
      float fog = smoothNoise(uv * 5.0 + vec2(t, t));
      vec3 dark = vec3(0.02, 0.05, 0.1);
      vec3 dreamy = vec3(0.31, 0.78, 0.95); // #50cbe4
      vec3 col = mix(dark, dreamy, fog);
      gl_FragColor = vec4(col, 0.4);
    }
  `,
  transparent: true,
});

// === Fullscreen Triangle ===
const geo = new THREE.BufferGeometry();
geo.setAttribute("position", new THREE.Float32BufferAttribute([
  -1, -1, 0, 3, -1, 0, -1, 3, 0
], 3));
const fogPlane = new THREE.Mesh(geo, fogMaterial);
scene.add(fogPlane);

// === Star Layer ===
const starCount = 150;
const starGeo = new THREE.BufferGeometry();
const pos = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
  pos[i*3] = Math.random() * 2 - 1;
  pos[i*3 + 1] = Math.random() * 2 - 1;
  pos[i*3 + 2] = 0;
}
starGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));

const starMat = new THREE.ShaderMaterial({
  uniforms: { iTime: { value: 0 } },
  vertexShader: `
    uniform float iTime;
    varying float twinkle;
    void main() {
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      twinkle = sin((position.x + position.y)*50.0 + iTime*2.0) * 0.5 + 0.5;
      gl_PointSize = 2.0 + twinkle * 4.0;
      gl_Position = projectionMatrix * mv;
    }
  `,
  fragmentShader: `
    varying float twinkle;
    void main() {
      vec2 coord = gl_PointCoord - 0.5;
      float dist = length(coord);
      float alpha = smoothstep(0.5, 0.0, dist) * twinkle;
      gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
    }
  `,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});
const stars = new THREE.Points(starGeo, starMat);
scene.add(stars);


function animate(t) {
  requestAnimationFrame(animate);
  let time = t * 0.001;
  fogMaterial.uniforms.iTime.value = time;
  starMat.uniforms.iTime.value = time;
  renderer.render(scene, camera);
}
animate();
