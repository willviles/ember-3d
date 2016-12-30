import Ember from 'ember';

const { assert, computed: { reads }, Evented, get, getProperties, typeOf } = Ember;

export default Ember.Object.extend(Evented, {
  identifier: 'object',

  scene: reads('container._scene'),

  init() {
    this._super(...arguments);

    this.setObject();

    this._createObject();

  },

  setObject() {
    assert('Cannot buildObject from base object mixin.');

  },

  _createObject() {
    if (typeOf(this.addToScene) === 'function') {
      this.addToScene();
    }

    if (typeOf(this.didCreateObject) === 'function') {
      this.didCreateObject();
    }

    if (typeOf(this.animate) === 'function') {
      this.animate();
    }

    this.trigger('didCreateObject');

  },

  addToScene() {
    const { scene, object } = getProperties(this, 'scene', 'object');

    scene.add(object);

  },

  getObject(objectId) {
    const container = get(this, 'container');
    const config = get(container, 'config');
    const targetObject = get(config, 'objects').findBy('id', objectId);

    return targetObject.export.create({ container: container, sceneId: targetObject.scene });
  },

  createObject(objectId) {
    const targetObject = this.getObject(objectId);
    return get(targetObject, 'object');

  },

});
