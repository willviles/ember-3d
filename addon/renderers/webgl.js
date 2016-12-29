import BaseRendererMixin from './base';

import { WebGLRenderer } from 'three';

export default BaseRendererMixin.extend({

  renderer: new WebGLRenderer()

});
