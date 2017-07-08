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

    center() {

        let v = Vector.subtract(this.vectors[2], this.vectors[1]);
        v.divide(2);
        v.add(this.vectors[0]);

        return v;
    }

}