import BoundingBox from './BoundingBox';
export default function Player(position) {

    this.boundingBox = new BoundingBox(position, 32, 32);

}

Player.prototype.translate = function(vector) {
    this.boundingBox.path.points[0].add(vector);

}