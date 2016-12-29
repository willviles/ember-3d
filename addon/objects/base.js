import Ember from 'ember';

const { assert, computed: { reads }, get, getProperties } = Ember;

export default Ember.Object.extend({
  identifier: 'object',

  scene: reads('container._scene'),

  createObject() {
    assert('Cannot createObject from base object mixin.');

  },

  addToScene() {
    const { scene, object } = getProperties(this, 'scene', 'object');

    scene.add(object);

    this.animate();

  },

  animate() {
    let cube = get(this, 'object');

    function loop() {
      requestAnimationFrame(loop);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
    }

    loop();
  }

});
