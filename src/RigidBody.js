import Vector from './Vector';

export default class RigidBody {

    constructor(position, points, edges) {
        this.position = position;
        
        this.edges = edges;
        this.vectors = points;

    }

    correctEdges() {
       
        //Iterate over each edge in this body 
        for(let i in this.edges) {
            let edge = this.edges[i];
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