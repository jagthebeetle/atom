goog.provide("atom.Renderer");

goog.require("goog.dom");
goog.require("atom.graph");
goog.require("atom.events");

/**
 * Grabs Model and pushes to View.
 * @constructor
 * @param {goog.events.pubsub.PubSub} omniBus  { description }
 */
atom.Renderer = function(omniBus) {
  this.VIEW_ELEMENT_TYPE = "DIV";
  this.viewElement = goog.dom.createDom(
    this.VIEW_ELEMENT_TYPE, { id: "view" }
  );
  this.transientElement = goog.dom.createDom(this.VIEW_ELEMENT_TYPE);
  this.graph = new atom.graph.AdjacencyList();

  goog.dom.appendChild(document.body, this.viewElement);
  goog.dom.appendChild(document.body, this.transientElement);
  omniBus.subscribe(atom.events.CHAR_PUSH, this.createTransient, this);
  omniBus.subscribe(atom.events.TOKEN_PUSH, this.setText, this);
};

atom.Renderer.prototype.setText = function(message) {
  var innerText = goog.dom.getTextContent(this.viewElement);
  var existing;
  goog.dom.setTextContent(this.viewElement,
    innerText + message);

  if (existing = this.graph.getByKey(message)) {
    window.newLink(existing)
  } else {
    this.graph.addVertexByKey(message);
  }
  window.newNode(this.graph.getByKey(message));
};

atom.Renderer.prototype.createTransient = function(c) {
  goog.dom.setTextContent(this.transientElement, c);
  goog.dom.appendChild(document.body, this.transientElement);
};