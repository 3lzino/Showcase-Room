// app.js
function initModelFrame(containerId, modelPath) {
    const container = document.getElementById(containerId);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(300, 300);
    container.appendChild(renderer.domElement);
  
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 1, 1).normalize();
    scene.add(light);
  
    let model;
    const loader = new THREE.GLTFLoader();
    loader.load(modelPath, function (gltf) {
      model = gltf.scene;
      scene.add(model);
    });
  
    camera.position.z = 5;
  
    function animate() {
      requestAnimationFrame(animate);
      if (model) model.rotation.y += 0.005;
      renderer.render(scene, camera);
    }
  
    animate();
  }
  
  initModelFrame('model1', 'path/to/your/model1.glb');
  initModelFrame('model2', 'path/to/your/model2.glb');
  initModelFrame('model3', 'path/to/your/model3.glb');
  