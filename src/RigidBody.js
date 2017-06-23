import Vector from './Vector';

export default class RigidBody {

    constructor(position, edges) {
        this.position = position;
        this.edges = edges;
    }

    correctEdges() {
       
        //Iterate over each edge in this body 
        for(let i in this.edges) {
            let edge = this.edges[i];
            edge.correct();
        }
    }

    translate(v) {
        this.edges[0].start.add(v);
        this.correctEdges(3);
        return this;
    }

}