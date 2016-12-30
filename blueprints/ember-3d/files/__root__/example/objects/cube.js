import Ember from 'ember';
import MeshObjectMixin from 'ember-3d/objects/mesh';
import { BoxGeometry, MeshBasicMaterial } from 'three';

const { get } = Ember;

export default MeshObjectMixin.extend({

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
