import Path from './Path';
import Vector from './Vector';
export default function BoundingBox(position, width, height) {
    this.path = new Path([
        new Vector(position.x, position.y),
        new Vector(position.x + width, position.y),
        new Vector(position.x + width, position.y + height),
        new Vector(position.x, position.y + height)
    ], [
        [ 0, 2]
    ]);
}