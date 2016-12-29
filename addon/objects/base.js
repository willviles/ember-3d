import Ember from 'ember';

const { assert, computed: { reads }, getProperties, typeOf } = Ember;

export default Ember.Object.extend({
  identifier: 'object',

  scene: reads('container._scene'),

  createObject() {
    assert('Cannot createObject from base object mixin.');

  },

  addToScene() {
    const { scene, object } = getProperties(this, 'scene', 'object');

    scene.add(object);

    if (typeOf(this.animate) === 'function') {
      this.animate();
    }

  }

});
