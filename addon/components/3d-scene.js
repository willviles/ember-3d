import Ember from 'ember';

const { assert, computed, computed: { reads }, get, isEqual, on, run, set, setProperties } = Ember;

export default Ember.Component.extend({

  // @property classNames
  //
  // Adds 3d-container as a base class.

  classNames: 'container--3d',

  // @property attributeBindings
  //
  // Binds the Three.js instance ID to a data tag.

  attributeBindings: ['id:data-3d-scene'],

  // @properties [_scene, _renderer, _camera]
  //
  // Reads properties from config objects.

  _scene: reads('config.scene.scene'),
  _renderer: reads('config.renderer.renderer'),
  _camera: reads('config.camera.camera'),

  // @function didInsertElement
  //
  // Extends didInsertElement to setup the Three.js instance.

  didInsertElement() {
    this._super(...arguments);

    const element = get(this, 'element');
    const {
      scene,
      renderer,
      camera,
      objects
    } = get(this, 'config');

    // Set component dimensions
    this.setDimensions();

    // Set the scene
    scene.setScene();

    // Set the renderer
    renderer.setRenderer();

    // Set the camera
    camera.setCamera();

    // Append the scene
    scene.appendScene(element);

    objects.forEach((object) => {
      setProperties(object, {
        container: this
      });

      object.createObject();

    });

    // Render the scene
    scene.renderScene();

  },

  // @computed config
  //
  // Gets the Three.js config based upon the ID and sets it as a property.

  config: on('init', computed(function() {
    const id = get(this, 'id');

    assert(`Must set Three.js scene id in component '3d-scene'`, id);

    let factory = Ember.getOwner(this)._lookupFactory(`3d:${id}`);

    this.setContainerOnFactoryObjects(factory);

    return factory;

  })),

  // @function setContainerOnFactoryObjects
  //
  // Adds the component to each factory object as 'container'.

  setContainerOnFactoryObjects(factory) {
    Object.keys(factory).forEach((key) => {
      if (isEqual(key, 'objects')) {
        get(factory, 'objects').forEach((object) => {
          set(object, 'container', this);
        });

      } else {
        set(factory, `${key}.container`, this);

      }

    });

  },

  // @function setDimensions
  //
  // Sets the width and height of the component.

  setDimensions() {
    const width = this.$().width();
    const height = this.$().height();

    setProperties(this, {
      width, height,
    });

  },

  // @property resize
  //
  // Boolean which determines whether the component should listen to browser window resize changes
  // and change the scene dimensions accordingly.

  resize: true,

  // @function setupResize
  //
  // Recalculates dimensions when window is resized.

  setupResize: on('didInsertElement', function() {

    if (!isEqual(get(this, 'resize'), true)) { return; }

    run.next(() => {
      Ember.$(window).resize(() => {
        run.debounce(this, 'setDimensions', 150);
      });
    });

  }),

});
