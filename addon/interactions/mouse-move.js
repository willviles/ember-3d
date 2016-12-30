import Ember from 'ember';
import BaseInteractionMixin from './base';

const { computed: { reads }, get, setProperties } = Ember;

export default BaseInteractionMixin.extend({

  width: reads('container.width'),
  height: reads('container.height'),

  normalizeMouseValues: false,

  init() {

    Ember.$(document)[0].addEventListener('mousemove', this.handleMouseMove.bind(this), false);

    this.setMouseValues({
      mouseX: 0, mouseY: 0
    });

  },



  setMouseValues(values) {
    let container = get(this, 'container');
    setProperties(container, values);

  },

  handleMouseMove(e) {

    let normalize = get(this, 'normalizeMouseValues');

    this.setMouseValues({

      mouseX: normalize ?
                -1 + (e.clientX / get(this, 'width')) * 2 :
                e.clientX,

      mouseY: normalize ?
                1 - (e.clientY / get(this, 'height')) * 2 :
                e.clientY

    });

  }

});
