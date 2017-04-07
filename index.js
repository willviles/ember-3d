/* eslint-env node */
'use strict';

var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');
var VersionChecker = require('ember-cli-version-checker');
var path = require('path');

module.exports = {
  name: 'ember-3d',

  included(app) {
    if (!isFastBoot()) {
      this.importBrowserDependencies(app);
    }

    return this._super.included.apply(this, arguments);
  },

  importBrowserDependencies(app) {
    if (arguments.length < 1) {
      throw new Error('Application instance must be passed to import');
    }

    // `using: []` syntax isavailable for Ember 2.9.0 and above only
    new VersionChecker(this).for('ember-cli', 'npm').assertAbove('2.9.0');

    app.import(this.treePaths.vendor + '/three/three.js', {
      using: [
        { transformation: 'amd', as: 'three' }
      ]
    });

  },

  treeForVendor(vendorTree) {
    if (isFastBoot()) {
      return vendorTree;
    } else {
      return this.treeForBrowserVendor(vendorTree);
    }
  },

  treeForBrowserVendor(vendorTree) {
    var trees = [];

    if (vendorTree) {
      trees.push(vendorTree);
    }

    trees.push(moduleToFunnel('three'));

    return mergeTrees(trees);
  }
};

function moduleToFunnel(moduleName) {
  return new Funnel(resolveModulePath(moduleName), {
    destDir: 'three',
    include: [new RegExp(/\.js$/)]
  });
}

function resolveModulePath(moduleName) {
  return path.dirname(require.resolve(moduleName));
}

// Checks to see whether this build is targeting FastBoot. Note that we cannot
// check this at boot time--the environment variable is only set once the build
// has started, which happens after this file is evaluated.
function isFastBoot() {
  return process.env.EMBER_CLI_FASTBOOT === 'true';
}
