import Ember from 'ember';
import GroupObjectMixin from 'ember-3d/objects/group';

const {
  get,
  getProperties
} = Ember;

export default GroupObjectMixin.extend({

  cloudCount: 20,

  buildObject() {

    const {
      group,
      cloudCount
    } = getProperties(this, 'group', 'cloudCount');

    // To distribute the clouds consistently,
    // we need to place them according to a uniform angle
    let stepAngle = Math.PI * 2 / cloudCount;

    // create the clouds
    for (let i = 0; i < cloudCount; i++) {

      let cloud = this.createObject('cloud');

      // set the rotation and the position of each cloud;
      // for that we use a bit of trigonometry
      let a = stepAngle * i; // this is the final angle of the cloud
      let h = 750 + Math.random() * 200; // this is the distance between the center of the axis and the cloud itself

      // Trigonometry!!! I hope you remember what you've learned in Math :)
      // in case you don't:
      // we are simply converting polar coordinates (angle, distance) into Cartesian coordinates (x, y)
      cloud.position.y = Math.sin(a) * h;
      cloud.position.x = Math.cos(a) * h;

      // rotate the cloud according to its position
      cloud.rotation.z = a + Math.PI / 2;

      // for a better result, we position the clouds
      // at random depths inside of the scene
      cloud.position.z = -400 - Math.random() * 400;

      // we also set a random scale for each cloud
      let scale = 1 + Math.random() * 2;
      cloud.scale.set(scale, scale, scale);

      // do not forget to add the mesh of each cloud in the scene
      group.add(cloud);
    }
  },

  didCreateObject() {
    let object = get(this, 'object');

    object.position.y = -600;

  },

  animate() {
    let sky = get(this, 'object');

    function loop() {
      sky.rotation.z += 0.01;
      requestAnimationFrame(loop);
    }

    loop();
  }

});
