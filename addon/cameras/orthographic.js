import Ember from 'ember';
import BaseCameraMixin from './base';

import { OrthographicCamera } from 'three';

const { computed, get, getProperties, isEmpty, observer, set } = Ember;

export default BaseCameraMixin.extend({

  near: 1,
  far: 10000,

  position: {
    x: 0,
    y: 0,
    z: 1000
  },

  frustums: computed('width', 'height', function() {
    const { width, height } = getProperties(this, 'width', 'height');

    if (isEmpty(width) || isEmpty(height)) { return; }

    // Set frustums
    return Ember.Object.create({
      left: width / -2,
      right: width / 2,
      top: height / 2,
      bottom: height / -2
    });

  }),

  // @function setCamera
  //
  // Adds a Three.js Camera and sets on the component.

  setCamera() {
    const {
      frustums,
      far,
      near
    } = getProperties(this, 'frustums', 'far', 'near');

    let camera = new OrthographicCamera(
      frustums.left, frustums.right, frustums.top, frustums.bottom, near, far
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

  // @observer frustumsChanged
  //
  // Updates Three.js camera when the aspect is changed.

  frustumsChanged: observer('frustums', function() {

    let { camera, frustums } = getProperties(this, 'camera', 'frustums');

    if (isEmpty(camera)) { return; }

    Object.keys(get(this, 'frustums')).forEach((key) => {
      camera[key] = frustums[key];
    });

    camera.updateProjectionMatrix();

  })

});
