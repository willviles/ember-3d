import Ember from 'ember';

const { computed: { reads } } = Ember;

export default Ember.Object.extend({
  identifier: 'camera',

  width: reads('container.width'),
  height: reads('container.height')

});
