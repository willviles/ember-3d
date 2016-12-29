import Ember from 'ember';
import { Scene } from 'three';

const { computed: { reads }, get, getProperties, set } = Ember;

export default Ember.Object.extend({
  identifier: 'scene',

  renderer: reads('container._renderer'),
  camera: reads('container._camera'),

  // @function setScene
  //
  // Adds a Three.js Scene and sets on the component.

  setScene() {
    let scene = new Scene();
    set(this, 'scene', scene);
  },

  // @function appendScene
  //
  // Appends the Three.js Scene to the component element.

  appendScene(element) {
    const renderer = get(this, 'renderer');
    element.appendChild(renderer.domElement);
  },

  // @function renderScene
  //
  // Renders the Three.js Scene using the given scene and camera.

  renderScene() {
    let {
      renderer,
      scene,
      camera
    } = getProperties(this, 'renderer', 'scene', 'camera');

    function renderLoop() {
      requestAnimationFrame(renderLoop);
      renderer.render(scene, camera);
    }

    renderLoop();

  },


});
