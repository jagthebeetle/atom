goog.provide('atom.InputMon');

goog.require('goog.events');
goog.require('goog.events.KeyCodes');

goog.require('atom.events');

/**
 * @constructor
 */
atom.InputMon = function(inputElement, omniBus) {
  this.inputElement = inputElement;
  this.prevLength = 0;
  this.DELIMITER = goog.events.KeyCodes.SPACE;
  this.omniBus = omniBus;
  this.word = "";

  goog.bind(registerCallbacks, this);
  registerCallbacks(this);

  function registerCallbacks(ctx) {
    goog.events.listen(document, goog.events.EventType.KEYPRESS, 
      goog.bind(ctx.patch, ctx));
  }
};

atom.InputMon.prototype.patch = function(event) {
  var key = event.keyCode
  if (key == this.DELIMITER) {
    this.omniBus.publish(atom.events.TOKEN_PUSH, this.word);
    this.word = "";
  } else {
    var char = String.fromCharCode(key);
    this.omniBus.publish(atom.events.CHAR_PUSH, char);
    this.word += char;
  }
};

atom.InputMon.prototype.writeToStream = function() {
  //noop
};