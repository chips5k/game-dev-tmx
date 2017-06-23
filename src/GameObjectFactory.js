import Vector from './Vector';
import Edge from './Edge';
import RigidBody from './RigidBody';

export default class GameObjectFactor {
    
    createSquareRigidBody(x, y, width, height) {
        let v1 = new Vector(x, y);
        let v2 = new Vector(x + width, y);
        let v3 = new Vector(x + width, y + height);
        let v4 = new Vector(x, x + height);

        let e1 = new Edge(v1, v2);
        let e2 = new Edge(v2, v3);
        let e3 = new Edge(v3, v4);
        let e4 = new Edge(v4, v1);
        let e5 = new Edge(v1, v3);
        let e6 = new Edge(v1, v4);

        let position = new Vector(x, y);
        let rigidBody = new RigidBody(position, [e1, e2, e3, e4, e5, e6]);

        
        return rigidBody;
    }
}