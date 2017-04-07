import Ember from 'ember';
import MeshObjectMixin from 'ember-3d/objects/mesh';
import {
  CylinderGeometry,
  FlatShading,
  Matrix4,
  MeshPhongMaterial
} from 'three';
import color from '../config/colors';

const {
  computed,
  get,
  getProperties,
  set
} = Ember;

export default MeshObjectMixin.extend({

  geometry: computed(function() {

    // create the geometry (shape) of the cylinder;
    // the parameters are:
    // radius top, radius bottom, height, number of segments on the radius, number of segments vertically
    let geometry = new CylinderGeometry(600, 600, 800, 40, 10);

    // rotate the geometry on the x axis
    geometry.applyMatrix(new Matrix4().makeRotationX(-Math.PI / 2));

    // important: by merging vertices we ensure the continuity of the waves
    geometry.mergeVertices();

    // get the vertices
    let l = geometry.vertices.length;

    // create an array to store new data associated to each vertex
    set(this, 'waves', Ember.A([]));

    for (var i = 0; i < l; i++) {
      // get each vertex
      let v = geometry.vertices[i];

      // store some data associated to it

      get(this, 'waves').pushObject({
        y: v.y,
        x: v.x,
        z: v.z,
        // a random angle
        ang: Math.random() * Math.PI * 2,
        // a random distance
        amp: 5 + Math.random() * 15,
        // a random speed between 0.016 and 0.048 radians / frame
        speed: 0.016 + Math.random() * 0.032
      });

    }


    return geometry;

  }),

  material: new MeshPhongMaterial({
    color: color.blue,
    transparent: true,
    opacity: 0.6,
    shading: FlatShading,
  }),

  didCreateObject() {
    this._super(...arguments);
    let object = get(this, 'object');

    object.receiveShadow = true;
    object.position.y = -600;

  },

  animate() {
    let {
      object,
      waves
    } = getProperties(this, 'object', 'waves');
    let sea = object;

    function loop() {

      // get the vertices
      let verts = sea.geometry.vertices,
        l = verts.length;

      for (var i = 0; i < l; i++) {
        let v = verts[i];

        // get the data associated to it
        let vprops = waves[i];

        // update the position of the vertex
        v.x = vprops.x + Math.cos(vprops.ang) * vprops.amp;
        v.y = vprops.y + Math.sin(vprops.ang) * vprops.amp;

        // increment the angle for the next frame
        vprops.ang += vprops.speed;

      }

      // Tell the renderer that the geometry of the sea has changed.
      // In fact, in order to maintain the best level of performance,
      // three.js caches the geometries and ignores any changes
      // unless we add this line
      sea.geometry.verticesNeedUpdate = true;

      sea.rotation.z += 0.005;
      requestAnimationFrame(loop);
    }

    loop();
  }

});
