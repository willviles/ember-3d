/*jshint node:true*/
'use strict';

module.exports = {
  normalizeEntityName: function() {
    // this prevents an error when the entityName is
    // not specified (since that doesn't actually matter
    // to us
  },

  fileMapTokens: function() {
    return {
      __root__: function() {
        return 'app/3d';
      }
    };
  }

};
