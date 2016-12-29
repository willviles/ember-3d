import Ember from 'ember';

const { computed: { reads }, get, isEmpty, observer } = Ember;

export default Ember.Object.extend({
  identifier: 'lighting',

  scene: reads('container._scene'),

  sceneCreated: observer('scene', function() {
    if (isEmpty(get(this, 'scene'))) { return; }

    this.addLighting();
  })

});
