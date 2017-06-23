import Vector from './Vector';

export default function Edge(start, end) {
    this.start = start;
    this.end = end;
    this.originalLength = Vector.subtract(end, start).magnitude();
}

//create a new edge that is e translated by v units 
Edge.translate = function(e, v) {
    let c = e.clone();
    c.start.add(v);
    c.end.add(v);
    return c;
}

//translate self by v units
Edge.prototype.translate = function(v) {
    this.start.add(v);
    this.end.add(v);
    return this;
}   

//create a new edge that is the project of e1 onto e2
Edge.project = function(e1, e2) {

    //obtain a vector representing the edge to project onto
    //E.g this is edge 2 orientation/length  but from origin 0, 0
    let axis = e2.difference();


    //Next project the start and end of edge 1 onto this axis
    let e1StartProjection = Vector.project(e1.start, axis);
    let e1EndProjection = Vector.project(e1.end, axis);


    //Next project edge 2 onto the axis we calculated from it 
    let e2StartProjection =  Vector.project(e2.start, axis);
    

    //Currently we have edge 1 projected against the axis of edge 2, the axis if you recall,
    //is drawn from origin, and not the true location of edge 2. thus we need to remove the projection of edge 2 (start) onto its axis projection, from projections A and B in order to reduce the two projections to their true unit lengths FROM the start of edge 2.
    // once the projection of edge 2 has been subtracted, we can then ADD the start of edge 2 to both, which provide us with the true coordinates.
    //The above is quite possibly the most fucked up comment i have written....i promise i'll come back and give it some love...
    let edge3 = new Edge(e1StartProjection.subtract(e2StartProjection).add(e2.start), e1EndProjection.subtract(e2StartProjection).add(e2.start));

    return edge3;

};  


//project self onto edge e
Edge.prototype.project = function(e) {
    this.start.project(e.end);
    this.end.project(e.end);
    return this;
}


Edge.prototype.difference = function() {
    return Vector.subtract(this.end, this.start);
}

Edge.difference = function(e) {
    return Vector.subtract(e.end, e.start);
}



Edge.prototype.clone = function() {
    return new Edge(this.start.clone(), this.end.clone());
}

Edge.clone = function(e) {
    return new Edge(e.start.clone(), e.end.clone());
}

Edge.prototype.normal = function() {
    //extract a normal/unit vector representing the orientation of this edge
    return Vector.subtract(this.end, this.start).normalize();
}
//Expand this edge by x units in either direction
Edge.prototype.expand = function(x) {

    let normal = this.normal();
    let expansion = Vector.multiply(normal, x);
    this.start.subtract(expansion);
    this.end.add(expansion);

    return this;

}

//Create a version of e expanded by x in either direction
Edge.expand = function(e, x) {
    let normal = e.normal();
    let expansion = Vector.multiply(normal, x);
    let c = e.clone();
    c.start.subtract(expansion);
    c.end.add(expansion);
    return c;
}

Edge.prototype.correct = function() {
    //Obtain the vector that represents this edge
    let diffVector = this.difference();
    
   
    //Obtain its current length
    let diffLength = diffVector.magnitude();

    //normalize so we can work with it later
    diffVector.normalize();
  
    //Calculate how much we need to increase/decrease each end of the edge's length
    diffVector.multiply((diffLength - this.originalLength) / 2);

    
    //Add the half length scaled diff vector to correct the edges
    this.start.add(diffVector);
    
    //Subtract the half length scaled diff vector to correct the edges
    this.end.subtract(diffVector);

    return this;
}

Edge.correct = function() {

    throw 'Not Implemented';
    
}