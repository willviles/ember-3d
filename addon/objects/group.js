import Ember from 'ember';
import BaseObjectMixin from 'ember-3d/objects/base';
import { Group } from 'three';

const { assert, computed, get, set } = Ember;

export default BaseObjectMixin.extend({

  group: computed(function() {
    return new Group();

  }),

  buildObject() {
    assert('Must override buildObject to add to the Object3D Group instance.');

  },

  setObject() {
    this.buildObject();

    set(this, 'object', get(this, 'group'));

  },

  addToGroup(objects) {
    objects.forEach((object) => {
      get(this, 'group').add(object);
    });

  }

});
