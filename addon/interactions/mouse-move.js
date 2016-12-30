import Ember from 'ember';
import BaseInteractionMixin from './base';

const { computed: { reads }, get, setProperties } = Ember;

export default BaseInteractionMixin.extend({
  init() {

    Ember.$(document)[0].addEventListener('mousemove', this.handleMouseMove.bind(this), false);

    this.setMouseValues({
      mouseX: 0, mouseY: 0
    });

  },

  width: reads('container.width'),
  height: reads('container.height'),

  setMouseValues(values) {
    let container = get(this, 'container');
    setProperties(container, values);

  },

  handleMouseMove(e) {

    this.setMouseValues({
      // here we are converting the mouse position value received
    	// to a normalized value varying between -1 and 1;
    	// this is the formula for the horizontal axis:

      mouseX: -1 + (e.clientX / get(this, 'width')) * 2,

      // for the vertical axis, we need to inverse the formula
    	// because the 2D y-axis goes the opposite direction of the 3D y-axis

      mouseY: 1 - (e.clientY / get(this, 'height')) * 2

    });

  }

});
