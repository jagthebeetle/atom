goog.provide("atom.main");

goog.require("goog.pubsub.PubSub");

goog.require("atom.InputMon");
goog.require("atom.Renderer");
goog.require("atom.events");

/** @export **/
atom.main = function() {
  var omniBus = new goog.pubsub.PubSub();
  var controller = new atom.InputMon(omniBus);
  // var modeler = new atom.StreamGrapher(omniBus);
  var view = new atom.Renderer(omniBus);

  return controller;
}

goog.exportSymbol('atom.main', atom.main);