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

  frustrums: computed('width', 'height', function() {
    const { width, height } = getProperties(this, 'width', 'height');

    if (isEmpty(width) || isEmpty(height)) { return; }

    // Set frustrums
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
      frustrums,
      far,
      near
    } = getProperties(this, 'frustrums', 'far', 'near');

    let camera = new OrthographicCamera(
      frustrums.left, frustrums.right, frustrums.top, frustrums.bottom, near, far
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

  // @observer frustrumsChanged
  //
  // Updates Three.js camera when the aspect is changed.

  frustrumsChanged: observer('frustrums', function() {

    let { camera, frustrums } = getProperties(this, 'camera', 'frustrums');

    if (isEmpty(camera)) { return; }

    Object.keys(get(this, 'frustrums')).forEach((key) => {
      camera[key] = frustrums[key];
    });

    camera.updateProjectionMatrix();

  })

});
