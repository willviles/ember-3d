# Ember 3D

Ember 3D is an Ember addon for using [Three.js](https://github.com/mrdoob/three.js) - an easy to use, lightweight, javascript 3D library. It is designed to add structure to creating Three.js projects and offers a library of helpers to quickly add scenes, renderers, cameras, lighting and objects.

## Folder structure

Ember 3D adds a folder named `3d` to your project's `app` folder. Ember 3D expects projects to be structured in the following manner:

```
app/
├── 3d/
|   └── scene-id/
|       ├── camera.js
|       ├── lighting.js
|       ├── objects/
|           └── object-id.js
|       ├── renderer.js
|       └── scene.js
```

## Template

To add a 3D scene to a template, use the `3d-scene` component with a camelized version of the scene id:

```handlebars
{{3d-scene id="sceneId"}}
```

## Scenes

Ember 3D offers a [BaseSceneMixin](https://github.com/willviles/ember-3d/blob/master/addon/scenes/base.js) which, under the hood, takes the renderer defined in `renderer.js` and camera defined in `camera.js`, creaters a Three.js scene and appends it to the DOM.

```javascript
import SceneMixin from 'ember-3d/scenes/base';

export default SceneMixin.create();
```

## Renderers

Ember 3D's [WebGLRendererMixin](https://github.com/willviles/ember-3d/blob/master/addon/renderers/webgl.js) extends the [BaseRendererMixin](https://github.com/willviles/ember-3d/blob/master/addon/renderers/base.js), which automatically resizes the renderer on dimension changes of the `3d-scene`.

```javascript
import WebGLRendererMixin from 'ember-3d/renderers/webgl';

export default WebGLRendererMixin.create();
```

## Cameras

Ember 3D allows for the creation of two types of Three.js camera, `perspectiveCamera` and `orthographicCamera`.

### Perspective Camera

The [PerspectiveCameraMixin](https://github.com/willviles/ember-3d/blob/master/addon/cameras/perspective.js) creates a Three.js `PerspectiveCamera`. The camera's `aspect` value is dynamically updated when the `3d-scene` dimensions change.

```javascript
import PerspectiveCameraMixin from 'ember-3d/cameras/perspective';

export default PerspectiveCameraMixin.create({
  viewAngle: 75,
  near: 1,
  far: 10000,
  setAspectDynamically: true,
  position: {
    x: 0,
    y: 0,
    z: 1000
  }
});
```

### Orthographic Camera

The [OrthographicCameraMixin](https://github.com/willviles/ember-3d/blob/master/addon/cameras/orthographic.js) creates a Three.js `OrthographicCamera`. Left, right, top and bottom frustrums are dynamically updated when the `3d-scene` dimensions change.

```javascript
import OrthographicCameraMixin from 'ember-3d/cameras/orthographic';

export default OrthographicCameraMixin.create({
  near: 1,
  far: 10000,

  position: {
    x: 50,
    y: 75,
    z: 1000
  }
});
```

## Lighting

The [BaseLightingMixin](https://github.com/willviles/ember-3d/blob/master/addon/lighting/base.js) offers a simple method of registering lighting onto the Three.js scene using the `addLighting` function.

```javascript
import BaseLightingMixin from 'ember-3d/lighting/base';

export default BaseLightingMixin.create({

  addLighting() {
    // Add lighting using:
    // get(this, 'scene').add(YOUR_LIGHTING);
  }

});
```

## Objects

The [BaseObjectMixin](https://github.com/willviles/ember-3d/blob/master/addon/objects/base.js) sets out a set of functions for registering 3D objects onto your Three.js scene. It also exposes an `animate` function for animating your objects. The `BaseObjectMixin` can't be used to create objects itself, but you can use one of the following mixins extended from it:

### Mesh

For example, the [MeshObjectMixin](https://github.com/willviles/ember-3d/blob/master/addon/objects/mesh.js) can easily create a cube, attach it to your scene and animate it:

```javascript
import Ember from 'ember';
import MeshObjectMixin from 'ember-3d/objects/mesh';
import { BoxGeometry, MeshBasicMaterial } from 'three';

const { get } = Ember;

export default MeshObjectMixin.create({

  geometry: new BoxGeometry(700, 700, 700, 10, 10, 10),
  material: new MeshBasicMaterial({color: 0xfffff, wireframe: true}),

  animate() {
    let cube = get(this, 'object');

    function loop() {
      requestAnimationFrame(loop);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
    }

    loop();
  }

});
```

Out-of-the-box support for other Three.js object types will be added in the near future.

## Contributing

Ember 3D is in its infancy. It will seek to be a flexible and elegant addon for creating complex 3D scenes, though at the moment is lacking a lot of functionality. Please feel free to contribute.

### Feature requests

Create feature requests [here](https://github.com/willviles/ember-3d/issues/new) and please tag your issue with `feature-request`.


<!-- ## Installation

* `git clone <repository-url>` this repository
* `cd ember-3d`
* `npm install`
* `bower install`

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/). -->
