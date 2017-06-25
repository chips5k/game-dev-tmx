import Vector from './Vector';

export default class RigidBody {

    constructor(position, points, boundaryEdges, constraintEdges) {
        this.position = position;
        
        this.boundaryEdges = boundaryEdges;
        this.constraintEdges = constraintEdges;
        this.vectors = points;

    }

    correctEdges() {
       
        //Iterate over each edge in this body 
        for(let i in this.constraintEdges) {
            let edge = this.constraintEdges[i];
            edge.correct();
        }
    }

    translate(v) {

        for(let i in this.vectors) {
            this.vectors[i].add(v);
        }
        
        return this;
    }

}