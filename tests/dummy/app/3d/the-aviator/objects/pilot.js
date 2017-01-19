import Ember from 'ember';
import GroupObjectMixin from 'ember-3d/objects/group';
import { BoxGeometry, Group, Matrix4, Mesh, MeshPhongMaterial, MeshLambertMaterial, FlatShading } from 'three';
import color from '../config/colors';

const { get, set } = Ember;

export default GroupObjectMixin.extend({

  buildObject() {

    this.addToGroup([
      this.torso(),
  	  this.face(),
      this.hairs(),
      this.glasses(),
      this.ears()
    ]);

  },

  addToScene: false,

  torso() {
  	const geometry = new BoxGeometry(15,15,15);
  	const material = new MeshPhongMaterial({color: color.brown, shading: FlatShading});
  	let torso = new Mesh(geometry, material);
    torso.position.set(2,-12,0);
  	return torso;
  },

  face() {
  	const geometry = new BoxGeometry(10,10,10);
  	const material = new MeshLambertMaterial({color: color.pink});
  	let face = new Mesh(geometry, material);
  	return face;
  },

  topHair() {
    // Hair element
  	const geometry = new BoxGeometry(4,4,4);
  	const material = new MeshLambertMaterial({color: color.brown});
  	let hair = new Mesh(geometry, material);
  	// Align the shape of the hair to its bottom boundary, that will make it easier to scale.
  	hair.geometry.applyMatrix(new Matrix4().makeTranslation(0,2,0));
    return hair;
  },

  sideHair() {
    const geometry = new BoxGeometry(12,4,2);
    const material = new MeshLambertMaterial({color: color.brown});
  	let sideHair = new Mesh(geometry, material);
    sideHair.geometry.applyMatrix(new Matrix4().makeTranslation(-6,0,0));
    return sideHair;
  },

  backHair() {
    // create the hairs at the back of the head
  	const geometry = new BoxGeometry(2,8,10);
    const material = new MeshLambertMaterial({color: color.brown});
  	let hairBack = new Mesh(geometry, material);
  	hairBack.position.set(-1,-4,0);
    return hairBack;
  },

  hairs() {
    // create a container for the hair
    let hairs = new Group(),

    // create a container for the hairs at the top
  	// of the head (the ones that will be animated)
        hairsTop = new Group();

    // Get the meshes for each type of hair
    let topHair = this.topHair(),
        sideHair = this.sideHair(),
        backHair = this.backHair();

    // create the hairs at the top of the head
  	// and position them on a 3 x 4 grid
  	for (let i = 0; i < 12; i++) {
  		let h = topHair.clone(),
          col = i%3,
          row = Math.floor(i/3),
          startPosZ = -4,
          startPosX = -4;

  		h.position.set(startPosX + row * 4, 0, startPosZ + col * 4);
  		hairsTop.add(h);
  	}

  	hairs.add(hairsTop);

    set(this, 'hairsTop', hairsTop);

    let sideHairL = sideHair.clone(),
        sideHairR = sideHair.clone();

  	sideHairL.position.set(8,-2,6);
  	sideHairR.position.set(8,-2,-6);

  	hairs.add(sideHairR);
  	hairs.add(sideHairL);
    hairs.add(backHair);
  	hairs.position.set(-5,5,0);

    return hairs;

  },

  glassesHalf() {
    const geometry = new BoxGeometry(5,5,5);
    const material = new MeshLambertMaterial({color: color.brown});
    let glassesHalf = new Mesh(geometry, material);
    return glassesHalf;
  },

  glassesA() {
    const geometry = new BoxGeometry(11,1,11);
  	const material = new MeshLambertMaterial({color: color.brown});
    let glassesA = new Mesh(geometry, material);
    return glassesA;
  },

  glasses() {
    let glasses = new Group(),
        glassesHalf = this.glassesHalf(),
        glassA = this.glassesA(),
        glassL = glassesHalf.clone(),
        glassR = glassesHalf.clone();

  	glassR.position.set(6,0,3);
  	glassL.position.z = -glassR.position.z;

    glasses.add(glassR);
    glasses.add(glassL);
    glasses.add(glassA);

    return glasses;
  },

  ear() {
    const geometry = new BoxGeometry(2,3,2);
    const material = new MeshLambertMaterial({ color: color.pink });
    let ear  = new Mesh(geometry, material);
    return ear;
  },

  ears() {
    let ears = new Group(),
        ear = this.ear(),
        earL = ear.clone(),
        earR = ear.clone();

    earL.position.set(0,0,-6);
  	earR.position.set(0,0,6);

    ears.add(earL);
    ears.add(earR);

	  return ears;
  },

  didCreateObject() {
    let object = get(this, 'object');
	  object.position.set(-10,27,0);

  },

  animate() {
    let hairsTop = get(this, 'hairsTop');
    let angleHairs = 20;

    let loop = () => {

      // get the hair
    	let hairs = hairsTop.children;

    	// update them according to the angle angleHairs
    	var l = hairs.length;

    	for (var i=0; i<l; i++){
    		var h = hairs[i];
    		// each hair element will scale on cyclical basis between 75% and 100% of its original size
    		h.scale.y = 0.75 + Math.cos(angleHairs+i/3) * 0.25;
    	}
    	// increment the angle for the next frame
    	angleHairs += 0.16;

      requestAnimationFrame(loop);
    };

    loop();
  }

});
