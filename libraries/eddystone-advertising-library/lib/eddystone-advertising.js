(() => {
  'use strict';
  let platform = require('./platform.js');
  let EddystoneFrameType = require('./eddystone-advertisement.js').EddystoneFrameType;

  /**
     Object that contains the characteristics of the package to adverstise.
     @typedef {Object} EddystoneAdvertisementOptions
     @property {EddystoneType} type Type of Eddystone.
     @property {string|undefined} url The URL to advertise
     @property {number|undefined} txPower The Tx Power to advertise
   */

  /**
     Exposes platform independent functions to register/unregister Eddystone
     Advertisements.
     @class
   */
  class Eddystone {
    /**
       @constructs Eddystone
     */
    constructor() {
      this._platform = platform();
      /**
         @member Eddystone#advertisements {EddystoneAdvertisement[]} Contains all
         previously registered advertisements.<br>
       ***Note:** In a Chrome App, if the event page gets killed users won't
         be able to unregister the advertisement.
       */
      this.advertisements = [];
    }
    /**
       Function to register an Eddystone BLE advertisement.
       @params {EddystoneAdvertisementOptions} options The characteristics
       of the advertised Eddystone
       @returns {Promise.<EddystoneAdvertisement>} Which `fulfills` with an
       {@link EddystoneAdvertisement} if the advertisement was registered
       successfully, `rejects` with `Error` otherwise.
     */
    registerAdvertisement(options) {
      let self = this;
      return new Promise((resolve, reject) => {
        if (!self._platform) {
          reject(new Error('Platform not supported.'));
          return;
        }
        Eddystone._checkAdvertisementOptions(options);
        return self._platform.registerAdvertisement(options).then(advertisement => {
          self.advertisements.push(advertisement);
          resolve(advertisement);
        }, reject);
      });
    }

    /**
       Checks that all the required properties are present for the specific
       Eddystone Frame Type
       @private
       @params {EddystoneAdvertisementOptions} options
       @throws {Error} If a required property is missing
     */
    static _checkAdvertisementOptions(options) {
      if (!('type' in options)) {
        throw new TypeError('Required member type is undefined.');
      }
      if (options.type === EddystoneFrameType.URL) {
        Eddystone._checkURLOptions(options);
      } else {
        throw new TypeError('Unsupported Frame Type: ' + options.type);
      }
    }

    /**
       Checks that all required properties are present for a
       Eddystone-URL advertisement
       @private
       @params {EddystoneAdvertisementOptions} options
       @throws {Error} If a required property is missing
     */
    static _checkURLOptions(options) {
      if (!('url' in options)) {
        throw new TypeError('Required member url is undefined.');
      }
      if (!('txPower' in options)) {
        throw new TypeError('Required member txPower is undefined.');
      }
    }
  }
  module.exports = Eddystone;
})();
