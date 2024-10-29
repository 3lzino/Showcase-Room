// app.js

let scenes = []; // Array to hold scenes for each model frame
let cameras = []; // Array to hold cameras for each model frame
let renderers = []; // Array to hold renderers for each model frame
let models = []; // Array to hold loaded models
let isRotating = false; // Flag to check if the model is being rotated
let previousMousePosition = { x: 0, y: 0 }; // Store previous mouse position
let isMouseInside = false; // Flag to check if the mouse is inside the frame
const defaultZoom = 4; // Default zoom level

// Debug element for rotation
const debugContainer = document.createElement('div');
debugContainer.style.position = 'absolute';
debugContainer.style.bottom = '0';
debugContainer.style.width = '100%';
debugContainer.style.textAlign = 'center';
debugContainer.style.color = 'white';
document.body.appendChild(debugContainer); // Append to body

// Initialize models in their respective frames
function initModelFrame(containerId, modelPath, customScale = null, customRotation = null) {
  const container = document.getElementById(containerId);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true });

  renderer.setSize(300, 300); // Set renderer size
  container.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 0.8);
  light.position.set(1, 1, 1).normalize();
  scene.add(light);

  let model;
  const loader = new THREE.GLTFLoader();
  loader.load(modelPath, function (gltf) {
    model = gltf.scene;

    // Set default or custom scale for each model
    const baseScale = 1.5; // Default scale factor
    const scale = customScale || baseScale;
    model.scale.set(scale, scale, scale);

    // Set default or custom rotation for each model
    const defaultRotation = { x: 0, y: Math.PI / 4, z: 0 };
    const rotation = customRotation || defaultRotation;
    model.rotation.set(rotation.x, rotation.y, rotation.z);

    // Center the model
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);

    // Offset model downward slightly for better alignment
    const downwardOffset = 0.1;
    model.position.y -= downwardOffset;

    scene.add(model);
    models.push(model); // Store the model

    // Store the scene, camera, and renderer
    scenes.push(scene);
    cameras.push(camera);
    renderers.push(renderer);

    camera.position.set(0, 0.3, defaultZoom); // Adjusted position for better view
    animate(scene, camera, renderer); // Start the animation loop
  });

  // Event listeners for mouse interactions
  container.addEventListener('mouseenter', () => isMouseInside = true);
  container.addEventListener('mouseleave', () => {
    isMouseInside = false;
    resetModel(model, camera); // Reset model and zoom when leaving the frame
  });
  container.addEventListener('wheel', (event) => onMouseWheel(event, camera, container));
  container.addEventListener('pointerdown', (event) => {
    if (event.button === 0) {
      isRotating = true; // Enable rotation on left mouse button down
      previousMousePosition = { x: event.clientX, y: event.clientY };
    }
  });
  container.addEventListener('pointerup', () => {
    isRotating = false; // Disable rotation on mouse release
    resetModel(model); // Reset model after mouse release
  });
  container.addEventListener('pointermove', (event) => onPointerMove(event, model));
}

function onMouseWheel(event, camera, container) {
  if (isMouseInside) {
    event.preventDefault();
    const zoomSpeed = 0.03; // Reduced zoom speed for less aggressive zoom
    const minZoom = 2; // Minimum zoom level
    const maxZoom = 8; // Maximum zoom level
    const zoomFactor = camera.position.z + event.deltaY * zoomSpeed;

    // Clamp zoom to within minZoom and maxZoom levels
    camera.position.z = Math.min(Math.max(zoomFactor, minZoom), maxZoom);
  } else {
    // Scroll horizontally when outside a model frame
    const scrollingFrame = document.querySelector(".scrolling-frame");
    scrollingFrame.scrollBy({
      left: event.deltaY,
      behavior: 'smooth'
    });
  }
}

function onPointerMove(event, model) {
  if (isRotating && model) {
    // Rotate the model based on mouse movement
    const deltaX = event.clientX - previousMousePosition.x;
    const deltaY = event.clientY - previousMousePosition.y;

    model.rotation.y += deltaX * 0.01; // Y-axis rotation for left/right movement
    model.rotation.x += deltaY * 0.01; // X-axis rotation for up/down movement
    model.rotation.z += deltaX * 0.005; // Z-axis rotation for smoother effect

    previousMousePosition = { x: event.clientX, y: event.clientY }; // Update previous mouse position

    // Update debug display with model rotation values
    debugContainer.innerText = `Rotation - X: ${(model.rotation.x).toFixed(2)}, Y: ${(model.rotation.y).toFixed(2)}, Z: ${(model.rotation.z).toFixed(2)}`;
  }
}

function resetModel(model, camera) {
  if (model) {
    // Reset the model's rotation to its original state
    model.rotation.set(0, 0, 0);
    model.position.set(0, -0.1, 0); // Set back to initial centered position with downward offset
  }
  // Reset zoom level to default
  if (camera) camera.position.z = defaultZoom;
}

function animate(scene, camera, renderer) {
  requestAnimationFrame(() => animate(scene, camera, renderer)); // Animation loop
  renderer.render(scene, camera); // Render the scene
}

// Initialize model frames with their respective models, scales, and rotations
initModelFrame('model1', '/assets/PhantomBlade.glb', 1.5 , { x: -0.05, y: Math.PI / 0, z: 0 });
initModelFrame('model2', '/assets/gem_boo.glb', 1.2, { x: Math.PI / -0.85, y: -1.59, z: Math.PI / -0.79 });
initModelFrame('model3', '/assets/PhantomBlade.glb', 1.5, { x: Math.PI / 4, y: 0, z: 0 });
initModelFrame('model4', '/assets/PhantomBlade.glb', 1.8, { x: 0, y: Math.PI / 3, z: 0 });
initModelFrame('model5', '/assets/PhantomBlade.glb', 2, { x: 0, y: Math.PI / 2, z: 0 });
initModelFrame('model6', '/assets/gem_boo.glb', 1.2, { x: Math.PI / 6, y: 0, z: Math.PI / 4 });
initModelFrame('model7', '/assets/PhantomBlade.glb', 1.5, { x: Math.PI / 4, y: 0, z: 0 });
initModelFrame('model8', '/assets/PhantomBlade.glb', 1.8, { x: 0, y: Math.PI / 3, z: 0 });
// Add more models as needed
