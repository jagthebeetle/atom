goog.provide('atom.InputMon');

goog.require('goog.events');
goog.require('goog.events.KeyCodes');
goog.require('atom.events');

/**
 * Anchor element between user input and rest of app.
 * Sets up 
 * @constructor
 * @param {goog.pubsub.PubSub} omniBus Event bus to which to publish input.
 * @param {object} inputElement The DOM element to which to bind.
 */
atom.InputMon = function(omniBus, inputElement) {
  /** @const **/
  this.inputElement = inputElement || document;
  /** @const **/
  this.omniBus = omniBus;
  /** @const **/
  this.DELIMITER = goog.events.KeyCodes.SPACE;
  /** @const {Array.<goog.events.EventType>}**/
  this.INPUT_EVENTS = [goog.events.EventType.KEYPRESS];
  this.word = "";

  // bind to DOM
  goog.events.listen(
    this.inputElement, 
    this.INPUT_EVENTS, 
    this.patch,
    false, // useCapture
    this   // context
  );
};

/**
 * Publishes input to appropriate topic, and locally builds tokens before
 * sending them.
 * @method patch
 * @param {<type>} event 
 */
atom.InputMon.prototype.patch = function(event) {
  var key = event.keyCode
  if (key == this.DELIMITER) {
    this.omniBus.publish(atom.events.TOKEN_PUSH, this.word);
    this.word = "";
  } else {
    var c = String.fromCharCode(key);
    this.omniBus.publish(atom.events.CHAR_PUSH, c);
    this.word += c;
  }
};
