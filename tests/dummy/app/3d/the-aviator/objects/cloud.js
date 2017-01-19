import Ember from 'ember';
import GroupObjectMixin from 'ember-3d/objects/group';
import { BoxGeometry, Mesh, MeshPhongMaterial } from 'three';
import color from '../config/colors';

const { getProperties } = Ember;

export default GroupObjectMixin.extend({

  // create a cube geometry;
  // this shape will be duplicated to create the cloud

  geometry: new BoxGeometry(20,20,20),

  // create a material; a simple white material will do the trick

  material: new MeshPhongMaterial({ color: color.white }),

  addToScene: false,

  buildObject() {

    const { geometry, material, group } = getProperties(this, 'geometry', 'material', 'group');

  	// duplicate the geometry a random number of times
  	let nBlocs = 3+Math.floor(Math.random()*3);

  	for (let i = 0; i < nBlocs; i++ ){

  		// create the mesh by cloning the geometry
  		let mesh = new Mesh(geometry, material);

  		// set the position and the rotation of each cube randomly
  		mesh.position.x = i*15;
  		mesh.position.y = Math.random()*10;
  		mesh.position.z = Math.random()*10;
  		mesh.rotation.z = Math.random()*Math.PI*2;
  		mesh.rotation.y = Math.random()*Math.PI*2;

  		// set the size of the cube randomly
  		let s = 0.1 + Math.random() * 0.9;
  		mesh.scale.set(s,s,s);

  		// allow each cube to cast and to receive shadows
  		mesh.castShadow = true;
  		mesh.receiveShadow = true;

  		// add the cube to the container we first created
  		group.add(mesh);
  	}
  }

});
