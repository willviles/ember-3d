import Ember from 'ember';
import BaseCameraMixin from './base';

import { PerspectiveCamera } from 'three';

const { computed, get, getProperties, isEmpty, observer, set } = Ember;

export default BaseCameraMixin.extend({

  viewAngle: 75,
  near: 1,
  far: 10000,
  setAspectDynamically: true,
  position: {
    x: 0,
    y: 0,
    z: 1000
  },

  aspect: computed('width', 'height', function() {
    const { width, height } = getProperties(this, 'width', 'height');

    if (isEmpty(width) || isEmpty(height)) { return; }

    // Set aspect
    return width / height;

  }),

  // @function setCamera
  //
  // Adds a Three.js Camera and sets on the component.

  setCamera() {
    const {
      aspect,
      far,
      near,
      viewAngle
    } = getProperties(this, 'aspect', 'far', 'near', 'viewAngle');

    let camera = new PerspectiveCamera(
      viewAngle, aspect, near, far
    );

    set(this, 'camera', camera);

    this.setCameraPosition();

  },

  // @function setCameraPosition
  //
  // Sets the Three.js camera position.

  setCameraPosition() {
    let { camera, position } = getProperties(this, 'camera', 'position');

    Object.keys(get(this, 'position')).forEach((key) => {
      camera.position[key] = position[key];
    });

  },

  // @observer aspectChanged
  //
  // Updates Three.js camera when the aspect is changed.

  aspectChanged: observer('aspect', function() {
    if (isEmpty(get(this, 'camera'))) { return; }

    const camera = get(this, 'camera');

    camera.aspect = get(this, 'aspect');
    camera.updateProjectionMatrix();
  })

});
