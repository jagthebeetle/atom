goog.provide('atom.graph');

/**
 * Implements a directed graph as adjacency list, designed for use with 
 * strings or numbers.
 * @constructor
 */
atom.graph.AdjacencyList = function() {
  this.vertices = {};
  this.population = 0;
};

/**
 * Allows the addition of one or more vertices, at the specified keys.
 * @param {...number} keys Keys at which to create new vertices
 * @return {boolean} 
 */
atom.graph.AdjacencyList.prototype.addVertexByKey = function(keys) {
  var self = this;
  var oldPopulation = self.population;
  Array.prototype.forEach.call(arguments, function(vertex) {
    if (!self.vertices[vertex]) {
      self.vertices[vertex] = new atom.graph._Vertex(vertex);
      self.population++;
    }
  });
  return (oldPopulation < self.population);
};

atom.graph.AdjacencyList.prototype.getByKey = function(key) {
  return this.vertices[key];
}


/**
 * Connects vertex A to vertex B without checking for either's existence.
 * This causes a TypeError if A does not exist, but will create a key
 * and set it to undefined if vertex B does not exist.
 * @throws {TypeError} If vertex a does not exist, accessing its adjacencies
 * is an error.
 */
atom.graph.AdjacencyList.prototype.connectToByKey = function(keyA, keyB) {
  this.vertices[keyA].adjacencies[keyB] = this.vertices[keyB];
  return true;
};

/**
 * Removes references to object from all vertices that might be connected
 * (iterating over all vertices) and then removes key from vertices array.
 * @param {number|string} deleteKey Vertex key to delete.
 * @return {boolean} Return value of delete operation
 */
atom.graph.AdjacencyList.prototype.deleteByKey = function(deleteKey) {
  Object.keys(this.vertices).forEach(function(hostKey) {
    delete this.vertices[hostKey].adjacencies[deleteKey];
  }, this);
  this.population--;
  return (delete this.vertices[deleteKey]);
};


/**
 * Represents a Vertex in the graph, encapsulating adjacencies and 
 * other properties of a vertex.
 * @constructor
 */
atom.graph._Vertex = function(name) {
  this.name = name;
  this.adjacencies = {};
};
