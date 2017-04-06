import Ember from 'ember';

const { assert, computed, computed: { reads }, get, isEqual, on, run, set, setProperties, typeOf } = Ember;

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

  _scene: reads('config.scene.instance.scene'),
  _renderer: reads('config.renderer.instance.renderer'),
  _camera: reads('config.camera.instance.camera'),

  // @function didInsertElement
  //
  // Extends didInsertElement to setup the Three.js instance.

  didInsertElement() {
    this._super(...arguments);

    const element = get(this, 'element');
    const { scene, renderer, camera } = get(this, 'config');

    // Set initial component size
    this.setupStretch();

    // Set component dimensions
    this.setDimensions();

    // Set the scene
    scene.instance.setScene();

    // Set the renderer
    renderer.instance.setRenderer();

    // Set the camera
    camera.instance.setCamera();

    // Append the scene
    scene.instance.appendScene(element);

    // Instantiate interactions & objects
    this.instantiate('interactions');
    this.instantiate('objects');

    // Render the scene
    scene.instance.renderScene();

  },

  // @computed config
  //
  // Gets the Three.js config based upon the ID and sets it as a property.

  config: computed(function () {
    let id = get(this, 'id');

    assert(`Must set Three.js scene id in component '3d-scene'`, id);

    id = Ember.String.dasherize(id);

    let factory = Ember.getOwner(this)._lookupFactory(`3d:${id}`);

    this.instantiateFactoryObjects(factory);

    return factory;

  }),


  // @function instantiateFactoryObjects
  //
  // Adds the component to each factory object as 'container'.

  instantiateFactoryObjects(factory) {

    Object.keys(factory).forEach((key) => {

      if (!['interactions', 'objects'].includes(key)) {
        let factoryRegistration = get(factory, key);
        let instance = factoryRegistration.export.create({
          container: this,
          sceneId: factoryRegistration.scene
        });

        set(factory, `${key}.instance`, instance);

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

  // @property stretch
  //
  // Boolean which determines whether the component should stretch to its parent container size.

  stretch: true,

  // @function setupResize
  //
  // Recalculates dimensions when window is resized.

  setupStretch() {

    if (get(this, 'stretch') !== true) { return; }

    this.$().css({
      position: 'absolute',
      top: '0', left: '0',
      width: '100%', height: '100%'
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

  // @function instantiate
  //
  // Setup objects.

  instantiate(type) {
    let typeArr = get(this, `config.${type}`);

    if (!typeArr || !(Array.isArray(typeArr))) {
      console.info(`No instantiate of "${type}", due to not added objects of this type`);
      return;
    }

    typeArr.forEach((object) => {
      let module = get(object, 'export');
      if (typeOf(module) !== 'class') { return; }
      module.create({
        container: this,
        sceneId: object.scene
      });

    });
  }

});
