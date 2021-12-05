const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// const controls = new THREE.FirstPersonControls(camera, renderer.domElement);
const ambientLight = new THREE.AmbientLight(0x999999);
const loader = new THREE.GLTFLoader();

let controls;


async function setupGraphics() {
  // camera.position.z = 14;
  // camera.position.y = 8;
  // camera.position.x = 0;

  // camera.rotateX(Math.PI / 4);

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0.0);
  document.body.appendChild(renderer.domElement);

  scene.add(ambientLight);
  const lights = [];
  lights[0] = new THREE.DirectionalLight(0xffffff, 0.5);
  lights[0].position.set(1, 0, 0);
  lights[1] = new THREE.DirectionalLight(0x11e8bb, 0.5);
  lights[1].position.set(0.75, 1, 0.5);
  lights[2] = new THREE.DirectionalLight(0x8200c9, 0.5);
  lights[2].position.set(-0.75, -1, 0.5);
  scene.add(lights[0]);
  scene.add(lights[1]);
  scene.add(lights[2]);


  let mesh = await loadGlb({ filePath: '../asset/SkeeBall.glb', position: {x: 0, y: 0, z: 0}, rotation: {x: 0, y: 0, z: 0}, scale: {x: 1, y: 1, z: 1} });
  setupStaticObjects();
  console.log(mesh);

  // setup a player object
  camera.rotation.set(Math.PI / 6, Math.PI, 0);
  camera.position.set(0, 5, -10);
  controls = new THREE.PlayerControls(camera, mesh);

}

function setupStaticObjects() {
  const geometry = new THREE.PlaneGeometry(20, 20);
  const material = new THREE.MeshBasicMaterial({
    color: 0xaaaaaa,
  });
  const plane = new THREE.Mesh(geometry, material);
  plane.rotation.x = -Math.PI/2;
  scene.add(plane);
}

function animate() {
  requestAnimationFrame(animate);
  if (controls) {
    controls.update();
  }
  renderer.render(scene, camera);
}

function registerEventListener() {
  window.addEventListener("resize", onWindowResize);
}

function loadGlb(data) {
  let { filePath, position, rotation, scale } = data;
  let mesh;

  return new Promise((resolve, reject) => {
    loader.load(
      filePath,
      function (glb) {
        mesh = glb.scene;
        mesh.position.set(position.x, position.y, position.z);
        mesh.rotation.set(rotation.x, rotation.y, rotation.z);
        mesh.scale.set(scale.x, scale.y, scale.z);
        scene.add(mesh);
        return resolve(mesh);
      }
    );
  });
}


function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// setupGraphics();
// registerEventListener();
// animate();