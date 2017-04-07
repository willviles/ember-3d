import Ember from 'ember';
import GroupObjectMixin from 'ember-3d/objects/group';
import {
  BoxGeometry,
  Matrix4,
  Mesh,
  MeshPhongMaterial,
  FlatShading
} from 'three';
import color from '../config/colors';

const {
  get,
  computed: {
    reads
  },
  getProperties,
  set
} = Ember;

export default GroupObjectMixin.extend({

  buildObject() {

    let pilot = this.createObject('pilot');

    this.addToGroup([
      this.cabin(),
      this.engine(),
      this.tail(),
      this.wing(),
      this.propeller(),
      this.wheels(),
      pilot
    ]);

  },

  cabin() {
    const geometry = new BoxGeometry(60, 50, 50, 1, 1, 1);
    const material = new MeshPhongMaterial({
      color: color.red,
      shading: FlatShading
    });
    let cabin = new Mesh(geometry, material);

    // we can access a specific vertex of a shape through
    // the vertices array, and then move its x, y and z property:
    geometry.vertices[4].y -= 10;
    geometry.vertices[4].z += 20;
    geometry.vertices[5].y -= 10;
    geometry.vertices[5].z -= 20;
    geometry.vertices[6].y += 30;
    geometry.vertices[6].z += 20;
    geometry.vertices[7].y += 30;
    geometry.vertices[7].z -= 20;

    cabin.castShadow = true;
    cabin.receiveShadow = true;
    return cabin;
  },

  engine() {
    const geometry = new BoxGeometry(20, 50, 50, 1, 1, 1);
    const material = new MeshPhongMaterial({
      color: color.white,
      shading: FlatShading
    });
    let engine = new Mesh(geometry, material);
    engine.position.x = 40;
    engine.castShadow = true;
    engine.receiveShadow = true;
    return engine;
  },

  tail() {
    const geometry = new BoxGeometry(15, 20, 5, 1, 1, 1);
    const material = new MeshPhongMaterial({
      color: color.red,
      shading: FlatShading
    });
    let tailPlane = new Mesh(geometry, material);
    tailPlane.position.set(-35, 25, 0);
    tailPlane.castShadow = true;
    tailPlane.receiveShadow = true;
    return tailPlane;
  },

  wing() {
    const geometry = new BoxGeometry(40, 8, 150, 1, 1, 1);
    const material = new MeshPhongMaterial({
      color: color.red,
      shading: FlatShading
    });
    let sideWing = new Mesh(geometry, material);
    sideWing.castShadow = true;
    sideWing.receiveShadow = true;
    return sideWing;
  },

  propeller() {
    const geometry = new BoxGeometry(20, 10, 10, 1, 1, 1);
    const material = new MeshPhongMaterial({
      color: color.brown,
      shading: FlatShading
    });

    let propeller = new Mesh(geometry, material);
    propeller.castShadow = true;
    propeller.receiveShadow = true;

    let blade = this.blades();

    propeller.add(blade);
    propeller.position.set(50, 0, 0);

    set(this, 'propeller', propeller);

    return propeller;
  },

  blades() {
    const geometry = new BoxGeometry(1, 100, 20, 1, 1, 1);
    const material = new MeshPhongMaterial({
      color: color.brownDark,
      shading: FlatShading
    });

    let blade = new Mesh(geometry, material);

    blade.position.set(8, 0, 0);
    blade.castShadow = true;
    blade.receiveShadow = true;

    return blade;

  },

  wheelProtector() {
    const geometry = new BoxGeometry(30, 15, 10, 1, 1, 1);
    const material = new MeshPhongMaterial({
      color: color.red,
      shading: FlatShading
    });

    let wheelProtector = new Mesh(geometry, material);
    return wheelProtector;
  },

  wheelAxis() {
    const geometry = new BoxGeometry(10, 10, 6);
    const material = new MeshPhongMaterial({
      color: color.brownDark,
      shading: FlatShading
    });
    let wheelAxis = new Mesh(geometry, material);
    return wheelAxis;
  },

  tyre() {
    const geometry = new BoxGeometry(24, 24, 4);
    const material = new MeshPhongMaterial({
      color: color.red,
      shading: FlatShading
    });

    let tyre = new Mesh(geometry, material);
    tyre.add(this.wheelAxis());
    return tyre;
  },

  suspension() {
    const geometry = new BoxGeometry(4, 20, 4);
    const material = new MeshPhongMaterial({
      color: color.red,
      shading: FlatShading
    });

    geometry.applyMatrix(new Matrix4().makeTranslation(0, 10, 0));

    let suspension = new Mesh(geometry, material);
    suspension.position.set(-35, -5, 0);
    suspension.rotation.z = -0.3;
    return suspension;
  },

  wheels() {
    let wheelProtector = this.wheelProtector(),
      wheelProtectorL = wheelProtector.clone(),
      wheelProtectorR = wheelProtector.clone();

    wheelProtectorR.position.set(25, -20, 25);
    wheelProtectorL.position.set(25, -20, -25);

    let tyre = this.tyre(),
      tyreL = tyre.clone(),
      tyreR = tyre.clone(),
      tyreB = tyre.clone();

    tyreR.position.set(25, -28, 25);
    tyreL.position.set(25, -28, -25);
    tyreB.scale.set(0.5, 0.5, 0.5);
    tyreB.position.set(-35, -5, 0);

    let suspension = this.suspension();

    return [
      wheelProtectorL,
      wheelProtectorR,
      tyreL, tyreR, tyreB,
      suspension
    ];

  },

  didCreateObject() {
    let object = get(this, 'object');

    object.scale.set(0.33, 0.33, 0.33);
    object.position.y = 100;

  },

  mouseX: reads('container.mouseX'),
  mouseY: reads('container.mouseY'),

  animate() {
    let {
      propeller,
      object
    } = getProperties(this, 'propeller', 'object');

    let loop = () => {

      let {
        mouseX,
        mouseY
      } = getProperties(this, 'mouseX', 'mouseY'),
        targetY = normalize(mouseY, -1, 1, 25, 175),
        targetX = normalize(mouseX, -1, 1, -100, 100);

      // Move the plane at each frame by adding a fraction of the remaining distance
      object.position.y += (targetY - object.position.y) * 0.1;
      object.position.x += (targetX - object.position.x);

      // Rotate the plane proportionally to the remaining distance
      object.rotation.z = (targetY - object.position.y) * 0.0128;
      object.rotation.x = (object.position.y - targetY) * 0.0064;

      propeller.rotation.x += 0.3;

      requestAnimationFrame(loop);
    };

    loop();
  }

});

function normalize(v, vmin, vmax, tmin, tmax) {

  var nv = Math.max(Math.min(v, vmax), vmin);
  var dv = vmax - vmin;
  var pc = (nv - vmin) / dv;
  var dt = tmax - tmin;
  var tv = tmin + (pc * dt);
  return tv;

}
