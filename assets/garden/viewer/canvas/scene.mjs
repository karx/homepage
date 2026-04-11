/**
 * scene.mjs — Three.js scene, camera, renderer, controls, raycasting.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let _renderer, _camera, _scene, _controls, _raycaster, _pointer;
let _container;

// ── Smooth camera animation state ─────────────────────────────────────────────
let _camAnim = null; // { fromPos, toPos, fromTarget, toTarget, t0, duration }

function _easeInOutQuad(t) { return t < 0.5 ? 2*t*t : -1 + (4 - 2*t)*t; }

function _animateCameraTo(toPos, toTarget, duration = 550) {
  _camAnim = {
    fromPos:    _camera.position.clone(),
    toPos,
    fromTarget: _controls.target.clone(),
    toTarget,
    t0:         performance.now(),
    duration,
  };
}
const _clickHandlers  = [];
const _dblClickHandlers = [];
const _hoverHandlers  = [];

export function initScene(container) {
  _container = container;
  const W = container.clientWidth  || window.innerWidth;
  const H = container.clientHeight || window.innerHeight;

  // Renderer
  _renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  _renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  _renderer.setSize(W, H);
  _renderer.setClearColor(0x000000, 1);
  _renderer.shadowMap.enabled = true;
  container.appendChild(_renderer.domElement);

  // Scene
  _scene = new THREE.Scene();

  // Camera
  _camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 600);
  _camera.position.set(0, 4, 22);

  // Lights
  _scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const key = new THREE.DirectionalLight(0xffffff, 0.9);
  key.position.set(8, 14, 8);
  _scene.add(key);
  const fill = new THREE.DirectionalLight(0x8888ff, 0.3);
  fill.position.set(-8, -4, -8);
  _scene.add(fill);

  // Controls
  _controls = new OrbitControls(_camera, _renderer.domElement);
  _controls.enableDamping   = true;
  _controls.dampingFactor   = 0.07;
  _controls.minDistance     = 1.5;
  _controls.maxDistance     = 200;
  _controls.screenSpacePanning = true;

  // Raycasting
  _raycaster = new THREE.Raycaster();
  _pointer   = new THREE.Vector2(-9999, -9999);

  _renderer.domElement.addEventListener('pointermove', _onPointerMove);
  _renderer.domElement.addEventListener('click',       _onClick);
  _renderer.domElement.addEventListener('dblclick',    _onDblClick);
  // Cancel programmatic animation if user grabs the camera
  _renderer.domElement.addEventListener('pointerdown', () => { _camAnim = null; });

  // Responsive resize
  new ResizeObserver(() => {
    const W = container.clientWidth, H = container.clientHeight;
    _camera.aspect = W / H;
    _camera.updateProjectionMatrix();
    _renderer.setSize(W, H);
  }).observe(container);

  // Animate loop
  _renderer.setAnimationLoop(_animate);

  return { scene: _scene, camera: _camera, renderer: _renderer, controls: _controls };
}

export function getScene()    { return _scene; }
export function getCamera()   { return _camera; }
export function getControls() { return _controls; }

/** Smoothly frame a set of meshes — animates camera to encompass all of them. */
export function frameNodes(meshes) {
  if (!meshes.length) return;
  const box = new THREE.Box3();
  meshes.forEach(m => box.expandByPoint(m.position));
  const center = box.getCenter(new THREE.Vector3());
  const size   = box.getSize(new THREE.Vector3());
  const dist   = Math.max(size.x, size.y, size.z) * 0.8 + 6;
  const toPos  = center.clone().add(new THREE.Vector3(0, dist * 0.25, dist));
  _animateCameraTo(toPos, center, 650);
}

/** Smoothly move camera to look at a world position. */
export function focusOn(position, distance = 14) {
  const target = new THREE.Vector3(...position);
  const toPos  = target.clone().add(new THREE.Vector3(0, distance * 0.3, distance));
  _animateCameraTo(toPos, target, 520);
}

export function onNodeClick(fn)    { _clickHandlers.push(fn); }
export function onNodeDblClick(fn) { _dblClickHandlers.push(fn); }
export function onNodeHover(fn)    { _hoverHandlers.push(fn); }

const _tickFns = [];
export function addTick(fn) { _tickFns.push(fn); }

function _animate() {
  // Smooth camera animation
  if (_camAnim) {
    const raw  = (performance.now() - _camAnim.t0) / _camAnim.duration;
    const t    = _easeInOutQuad(Math.min(raw, 1));
    _camera.position.lerpVectors(_camAnim.fromPos, _camAnim.toPos, t);
    _controls.target.lerpVectors(_camAnim.fromTarget, _camAnim.toTarget, t);
    if (raw >= 1) _camAnim = null;
  }
  _controls.update();
  _tickFns.forEach(fn => fn());
  _renderer.render(_scene, _camera);
}

function _onPointerMove(e) {
  const rect = _renderer.domElement.getBoundingClientRect();
  _pointer.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
  _pointer.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
}

function _hitQid() {
  _raycaster.setFromCamera(_pointer, _camera);
  const hits = _raycaster.intersectObjects(_scene.children, true);
  if (!hits.length) return null;
  let obj = hits[0].object;
  while (obj && !obj.userData.qid) obj = obj.parent;
  return obj?.userData?.qid ?? null;
}

function _onClick() {
  const qid = _hitQid();
  if (qid) _clickHandlers.forEach(fn => fn(qid));
}

function _onDblClick() {
  const qid = _hitQid();
  if (qid) _dblClickHandlers.forEach(fn => fn(qid));
}

// Hover — called each frame from animate loop
export function tickHover() {
  _raycaster.setFromCamera(_pointer, _camera);
  const hits = _raycaster.intersectObjects(_scene.children, true);
  if (!hits.length) { _hoverHandlers.forEach(fn => fn(null)); return; }
  let obj = hits[0].object;
  while (obj && !obj.userData.qid) obj = obj.parent;
  _hoverHandlers.forEach(fn => fn(obj?.userData?.qid ?? null));
}
