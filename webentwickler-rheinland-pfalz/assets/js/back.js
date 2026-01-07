import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.155/build/three.module.js";
import { EffectComposer } from "https://cdn.jsdelivr.net/npm/three@0.155/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://cdn.jsdelivr.net/npm/three@0.155/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "https://cdn.jsdelivr.net/npm/three@0.155/examples/jsm/postprocessing/UnrealBloomPass.js";

// ESCENA
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// CAMARA
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(6, 8, 6);
camera.lookAt(0, 0, 0);

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// ------------------------------------------------
// POSTPROCESSING (BLOOM)
// ------------------------------------------------
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.4,   // fuerza del bloom
    0.45,  // radio
    0.0    // threshold
);
composer.addPass(bloomPass);

// ------------------------------------------------
// LUCES
// ------------------------------------------------
scene.add(new THREE.AmbientLight(0xffffff, 0.3));

const light = new THREE.PointLight(0xffffff, 5, 40);
light.position.set(0, 5, 0);
scene.add(light);

// ------------------------------------------------
// UTILIDADES
// ------------------------------------------------
function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sin(t, h) {
    return Math.sin(t) * h;
}

function rgbToHex(r, g, b) {
    return (r << 16) | (g << 8) | b;
}

// ------------------------------------------------
// CREACIÓN DE CUBOS
// ------------------------------------------------
const cubes = [];

for (let x = -6; x <= 6; x++) {
    for (let z = -6; z <= 6; z++) {

        const geo = new THREE.BoxGeometry(1, 1, 1);

        const colored = Math.random() > 0.75;

        const material = new THREE.MeshStandardMaterial({
            color: colored ? 0x0000ff : 0x080808,
            roughness: 0.4,
            metalness: 0.7
        });

        const mesh = new THREE.Mesh(geo, material);
        mesh.position.set(x, 0, z);
        scene.add(mesh);

        cubes.push({
            mesh,
            colored,
            height: randint(1, 10) / 10,
            offset: randint(0, 300) / 100
        });
    }
}

// ------------------------------------------------
// COLOR DINÁMICO
// ------------------------------------------------
const dynColor = {
    r: 0, g: 0, b: 255,
    rt: 0, gt: 0, bt: 255,
    rs: 0, gs: 0, bs: 0
};

function updateDynamicColor() {
    if (
        Math.abs(dynColor.r - dynColor.rt) < 5 &&
        Math.abs(dynColor.g - dynColor.gt) < 5 &&
        Math.abs(dynColor.b - dynColor.bt) < 5
    ) {
        dynColor.rt = randint(0, 255);
        dynColor.gt = randint(0, 255);
        dynColor.bt = randint(0, 255);

        const div = 25;
        dynColor.rs = (dynColor.rt > dynColor.r ? randint(5, 40) : -randint(5, 40)) / div;
        dynColor.gs = (dynColor.gt > dynColor.g ? randint(5, 40) : -randint(5, 40)) / div;
        dynColor.bs = (dynColor.bt > dynColor.b ? randint(5, 40) : -randint(5, 40)) / div;
    }

    dynColor.r += dynColor.rs;
    dynColor.g += dynColor.gs;
    dynColor.b += dynColor.bs;

    return rgbToHex(
        Math.round(dynColor.r),
        Math.round(dynColor.g),
        Math.round(dynColor.b)
    );
}

// ------------------------------------------------
// ANIMACIÓN
// ------------------------------------------------
let time = 0;

function animate() {
    requestAnimationFrame(animate);

    time++;

    // Movimiento suave de cámara
    camera.position.y += sin(time * 0.004, 0.006);
    camera.position.x += sin(time * 0.003 + 2, 0.006);
    camera.position.z += sin(time * 0.005 + 1, 0.006);
    camera.lookAt(0, 0, 0);

    // Color dinámico con bloom
    const colorHex = updateDynamicColor();

    // Animación de cubos
    for (const c of cubes) {
        c.mesh.position.y = sin(time / 60 + c.offset, c.height);
        if (c.colored) c.mesh.material.color.setHex(colorHex);
    }

    // Render con BLOOM
    composer.render();
}

animate();

// RESIZE
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});
