import Ember from 'ember';
import BaseObjectMixin from 'ember-3d/objects/base';
import { Group } from 'three';

const { assert, computed, get, isArray, set } = Ember;

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

  addToGroup() {

    let args = Array.prototype.slice.call(arguments);
    let group = get(this, 'group');

    args.forEach((arg) => {

      if (isArray(arg)) {
        arg.forEach((object) => {

          if (isArray(object)) {
            object.forEach((_object) => {
              group.add(_object);
            });

          } else {
            group.add(object);

          }

        });

      } else {
        group.add(arg);

      }
    });

  }

});
