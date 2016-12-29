import MeshObjectMixin from 'ember-3d/objects/mesh';

import { BoxGeometry, MeshBasicMaterial } from 'three';

export default MeshObjectMixin.create({

  geometry: new BoxGeometry(700, 700, 700, 10, 10, 10),
  material: new MeshBasicMaterial({color: 0xfffff, wireframe: true})

});
