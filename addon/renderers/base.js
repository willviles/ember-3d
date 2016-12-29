import Ember from 'ember';

const { computed: { reads }, get, getProperties, isEmpty, observer } = Ember;

export default Ember.Object.extend({
  identifier: 'renderer',

  width: reads('container.width'),
  height: reads('container.height'),

  // @function setRenderer
  //
  // Adds a Three.js Renderer and sets on the component.

  setRenderer() {
    this.setRendererSize();

  },

  // @function setRendererSize
  //
  // Sets the renderer size from component height and width.

  setRendererSize: observer('width', 'height', function() {
    if (isEmpty(get(this, 'renderer'))) { return; }

    const { height, renderer, width } = getProperties(this, 'height', 'renderer', 'width');

    renderer.setSize(width, height);

  })

});
