goog.provide("atom");

goog.require("goog.pubsub.PubSub");

goog.require("atom.InputMon");
goog.require("atom.Renderer");
goog.require("atom.events");

atom.main = function() {
  var omniBus = new goog.pubsub.PubSub();
  var controller = new atom.InputMon(null, omniBus);
  var view = new atom.Renderer();

  omniBus.subscribe(atom.events.CHAR_PUSH, view.createTransient, view);
  omniBus.subscribe(atom.events.TOKEN_PUSH, view.setText, view);

  return controller;
}