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
  this.graph = new atom.graph.AdjacencyList();

  this.VIEW_ELEMENT_TYPE = "DIV";
  this.viewElement = goog.dom.createDom(
    this.VIEW_ELEMENT_TYPE, { id: "view" }
  );
  this.transientElement = goog.dom.createDom(this.VIEW_ELEMENT_TYPE);

  goog.dom.appendChild(document.body, this.viewElement);
  goog.dom.appendChild(document.body, this.transientElement);
  omniBus.subscribe(atom.events.CHAR_PUSH, this.createTransient, this);
  omniBus.subscribe(atom.events.TOKEN_PUSH, this.setText, this);
};

/**
 * On receiving a token from the event bus, determines the
 * updates to be made to the model and view
 * @param {string} message The newest input token.
 */
atom.Renderer.prototype.setText = function(message) {
  // update view text
  var innerText = goog.dom.getTextContent(this.viewElement);
  goog.dom.setTextContent(this.viewElement,
    innerText + message);

  // do we create a node?
  var existingNode = this.graph.getByKey(message);
  if (existingNode) {
    // if new node is connected to this one already
    // or if it is self
    var edgeExists = 0
      || !!existingNode.adjacencies[this.prev.name] 
      || !!this.prev.adjacencies[existingNode.name]
      || this.prev.name == existingNode.name;
      console.log(edgeExists, existingNode, this.prev);
    if (!edgeExists) {
      this.graph.connectToByKey(this.prev.name, existingNode.name);
      this.newLinkTo(existingNode, this.prev);
      this.drawGraph();
    }
  } else {
    // create node
    this.graph.addVertexByKey(message);
    existingNode = this.graph.getByKey(message);
    this.newNode(existingNode);
    // link to previous if exists
    if (this.prev) {
      this.graph.connectToByKey(existingNode.name, this.prev.name);
    }
  }
  this.prev = existingNode;
};

atom.Renderer.prototype.createTransient = function(c) {
  goog.dom.setTextContent(this.transientElement, c);
  goog.dom.appendChild(document.body, this.transientElement);
};

atom.Renderer.prototype.initD3 = function() {
  this.width = 960;
  this.height = 500;

  this.fill = d3.scale.category20().domain(d3.range(0,20));;

  this.force = d3.layout.force()
      .size([this.width, this.height])
      .linkDistance(50)
      .charge(-50)
      .gravity(0)
      .alpha(.05)
      .friction(.2)
      .on("tick", goog.bind(this.tick, this));

  this.svg = d3.select("body").append("svg")
      .attr("width", this.width)
      .attr("height", this.height);

  this.svg.append("rect")
      .attr("width", this.width)
      .attr("height", this.height);

  this.nodes = this.force.nodes();
  this.links = this.force.links();
  this.node = this.svg.selectAll(".node");
  this.link = this.svg.selectAll(".link");

  this.prev = null;

  this.drawGraph();
}

atom.Renderer.prototype.newNode = function(nodeRef) {
  nodeRef.x = this.width / 4 + Math.floor(Math.random() * (this.width/2)); 
  nodeRef.y = this.height / 4 + Math.floor(Math.random() * (this.height/2));
  nodeRef.type = nodeRef.name.length;
  
  this.nodes.push(nodeRef);
  
  if (this.prev) {
    this.links.push({source: nodeRef, target: this.prev});
  }

  this.drawGraph();
}

atom.Renderer.prototype.newLinkToPrev = function(existing) {
  this.links.push({source: this.prev, target: existing})
}

atom.Renderer.prototype.newLinkTo = function(a, b) {
  this.links.push({source: a, target: b})
}

atom.Renderer.prototype.tick = function() {
  var self = this;
  self.link
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  self.node
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .style("fill", function(d) { return self.fill(d.type); });
}

atom.Renderer.prototype.drawGraph = function() {
  this.link = this.link.data(this.links);

  this.link.enter().insert("line", ".node")
      .attr("class", "link");

  this.node = this.node.data(this.nodes);

  this.node.enter().insert("circle", ".cursor")
      .attr("class", "node")
      .attr("r", 5)
      .call(this.force.drag);

  this.force.start();
}
