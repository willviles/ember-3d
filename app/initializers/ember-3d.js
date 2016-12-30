/* global requirejs, require */
import Ember from 'ember';
import ENV from '../config/environment';

const { assign, get, isArray, set } = Ember;

export function initialize(application) {

  const factoryRegistrations = Ember.A([]);

  Object.keys(requirejs.entries).filter((key) => {
    return new RegExp(`^${ENV.modulePrefix}/3d/(.*)`).test(key);

  }).forEach((modulePath) => {

    const moduleParts = modulePath.split('/');
    const sceneName = Ember.String.dasherize(moduleParts[2]);
    const topLevelItem = moduleParts[3];

    let factoryRegistration = { path: modulePath, scene: sceneName };

    if (['camera', 'lighting', 'renderer', 'scene'].includes(topLevelItem)) {
      factoryRegistrations.pushObject(
        assign(factoryRegistration, { type: topLevelItem })
      );

    }

    if (['objects'].includes(topLevelItem)) {
      factoryRegistrations.pushObject(
        assign(factoryRegistration, { type: 'object', id: moduleParts[moduleParts.length - 1] })
      );

    }

  });

  factoryRegistrations.mapBy('scene').uniq().forEach((scene) => {

    let injection = Ember.Object.create({});

    factoryRegistrations.filterBy('scene', scene).forEach((factoryRegistration) => {

      factoryRegistration.export = require(factoryRegistration.path).default;

      if (factoryRegistration.type === 'object') {
        if (!isArray(get(injection, 'objects'))) {
          set(injection, 'objects', Ember.A([]));
        }

        get(injection, 'objects').pushObject(factoryRegistration);

      } else {

        set(injection, factoryRegistration.type, factoryRegistration);

      }
    });

    application.register(`3d:${scene}`, injection);

  });

}

export default {
  name: 'ember-3d',
  initialize
};
