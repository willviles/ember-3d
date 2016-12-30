/* global requirejs, require */
import Ember from 'ember';
import ENV from '../config/environment';

const { assign, get, isArray, isPresent, set, typeOf } = Ember;

export function initialize(application) {

  const sceneModules = Ember.A([]);

  Object.keys(requirejs.entries).filter((key) => {
    return new RegExp(`^${ENV.modulePrefix}/3d/(.*)`).test(key);

  }).forEach((modulePath) => {

    const moduleParts = modulePath.split('/');
    const sceneName = Ember.String.camelize(moduleParts[2]);
    const topLevelItem = moduleParts[3];

    let sceneModule = { path: modulePath, scene: sceneName };

    if (['camera', 'lighting', 'renderer', 'scene'].includes(topLevelItem)) {
      sceneModules.pushObject(assign(sceneModule, { type: topLevelItem }));

    }

    if (['objects'].includes(topLevelItem)) {
      sceneModules.pushObject(assign(sceneModule, { type: 'object' }));

    }

  });

  sceneModules.mapBy('scene').uniq().forEach((scene) => {

    let injection = Ember.Object.create({});

    sceneModules.filterBy('scene', scene).forEach((moduleObj) => {

      let module = require(moduleObj.path).default;

      if (typeOf(module) === 'class') {
        module = module.create();
      }

      if (!isPresent(module) ||
          typeOf(module) !== 'instance' ||
          get(module, 'identifier') !== moduleObj.type) {

        throw new Error(`${ENV.modulePrefix}/app/3d/${moduleObj.type} must export a ${moduleObj.type} object instance`);

      }

      if (moduleObj.type === 'object') {
        if (!isArray(get(injection, 'objects'))) {
          set(injection, 'objects', Ember.A([]));
        }

        get(injection, 'objects').pushObject(module);

      } else {
        set(injection, moduleObj.type, module);

      }
    });

    application.register(`3d:${scene}`, injection);

  });

}

export default {
  name: 'ember-3d',
  initialize
};
