import Ember from 'ember';
import BaseRendererMixin from './base';
import { WebGLRenderer } from 'three';

const { computed, get } = Ember;

export default BaseRendererMixin.extend({

  renderer: computed(function() {
    const options = get(this, 'options') || {};
    return new WebGLRenderer(options);
  })

});
