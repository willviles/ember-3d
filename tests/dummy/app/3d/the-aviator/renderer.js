import WebGLRendererMixin from 'ember-3d/renderers/webgl';

export default WebGLRendererMixin.extend({

  options: {
    // Allow transparency to show the gradient background
		// we defined in the CSS
		alpha: true,

		// Activate the anti-aliasing; this is less performant,
		// but, as our project is low-poly based, it should be fine :)
		antialias: true,

    shadowMap: {
      enabled: true
    }

  }

});
