import Ember from 'ember';
import SceneMixin from 'ember-3d/scenes/base';
import { Fog } from 'three';

const { get, on } = Ember;

export default SceneMixin.extend({

  addFog: on('didSetScene', function() {
    get(this, 'scene').fog = new Fog(0xf7d9aa, 100, 950);

  })

});
