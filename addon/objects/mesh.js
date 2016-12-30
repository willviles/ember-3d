import Ember from 'ember';
import BaseObjectMixin from 'ember-3d/objects/base';
import { Mesh } from 'three';

const { assert, getProperties, set } = Ember;

export default BaseObjectMixin.extend({

  setObject() {
    const { geometry, material } = getProperties(this, 'geometry', 'material');

    assert('Must add a valid geometry property to object.', geometry);
    assert('Must add a valid material property to object.', material);

    set(this, 'object', new Mesh(geometry, material));

  }

});
