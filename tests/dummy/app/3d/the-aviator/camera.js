import PerspectiveCameraMixin from 'ember-3d/cameras/perspective';

export default PerspectiveCameraMixin.extend({
  viewAngle: 60,
  near: 1,
  far: 10000,
  setAspectDynamically: true,
  position: {
    x: 0,
    y: 100,
    z: 200
  },
});
