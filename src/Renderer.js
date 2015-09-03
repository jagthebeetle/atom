goog.provide("atom.Renderer");

goog.require("goog.dom");

goog.require("atom.graph");

atom.Renderer = function() {
  this.VIEW_ELEMENT_TYPE = "DIV";
  this.viewElement = goog.dom.createDom(
    this.VIEW_ELEMENT_TYPE,{
      id: "view"
    });
  this.transientElement = goog.dom.createDom(
    this.VIEW_ELEMENT_TYPE);

  this.graph = new atom.graph.AdjacencyList();

  goog.dom.appendChild(document.body, this.viewElement);
  goog.dom.appendChild(document.body, this.transientElement);

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

atom.Renderer.prototype.createTransient = function(char) {
  goog.dom.setTextContent(this.transientElement, 
    char);
  goog.dom.appendChild(document.body, this.transientElement);
};