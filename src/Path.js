import Vector from './Vector';
export default function Path(points, constraints) {
    this.points = points;
    this.edges = [];
    this.constraints = [];
    
    for(let i in constraints) {
        let constraint = constraints[i];
        this.constraints.push({
            path: [this.points[constraint[0]], this.points[constraint[1]]],
            length: Vector.subtract(this.points[constraint[1]], this.points[constraint[0]]).magnitude()
        })
    }

    var currentEdge = [];
    for(let i in this.points) {
        
        if(currentEdge.length < 2) {
            currentEdge.push(this.points[i]);
            if(currentEdge.length === 2) {
                this.edges.push({
                    path: currentEdge.slice(),
                    length: Vector.subtract(currentEdge[1], currentEdge[0]).magnitude()
                });
                currentEdge[0] = currentEdge[1];
                currentEdge.length = 1;
            }
        }
    }

    currentEdge.push(this.points[0]);
    //Close out the path with the final edge
    this.edges.push({
        path: currentEdge.slice(),
        length: Vector.subtract(currentEdge[1], currentEdge[0]).magnitude()
    });

}

Path.prototype.moveTo = function(position) {
    this.points[0].x = position.x;
    this.points[0].y = position.y;
    this.correctEdges();
}

Path.prototype.correctEdges = function() {
    
    for(var x = 0; x < 3; x++) {
        for(let i in this.edges) {
            let edge = this.edges[i];
            //Calculate current length
            
            let v1v2 = Vector.subtract(edge.path[1], edge.path[0]);
            let v1v2Length = v1v2.magnitude();

            v1v2.normalize();
            
            let diff = v1v2Length - edge.length;
            
            edge.path[0].add(Vector.multiply(v1v2, diff/2));
            edge.path[1].subtract(Vector.multiply(v1v2, diff/2));

        }
    
        //Apply constraints
        for(let i in this.constraints) {
            let constraint = this.constraints[i];
            
            let v1v2 = Vector.subtract(constraint.path[1], constraint.path[0]);
            let v1v2Length = v1v2.magnitude();

            v1v2.normalize();
            
            let diff = v1v2Length - constraint.length;
            
            constraint.path[0].add(Vector.multiply(v1v2, diff/2));
            constraint.path[1].subtract(Vector.multiply(v1v2, diff/2));
        }
    }
}   