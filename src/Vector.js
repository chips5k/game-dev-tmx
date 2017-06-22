export default function Vector(x, y) {
    this.x = x;
    this.y = y;
}

Vector.prototype.magnitude = function() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
}
    
Vector.prototype.invert = function() {
    this.x = -this.x;
    this.y = -this.y;
    return this;
}
Vector.invert = function(v) {
    return new Vector(-v.x, -v.y);
}

Vector.prototype.clone = function() {
    return new Vector(this.x, this.y);
}

Vector.prototype.add = function(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
};

Vector.add = function(v1, v2) {
    return new Vector(v1.x + v2.x, v1.y + v2.y);
};

Vector.prototype.subtract = function(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
};

Vector.subtract = function(v1, v2) {
    return new Vector(v1.x - v2.x, v1.y - v2.y);
};

Vector.prototype.normalize = function(v) {
        this.divide(this.magnitude());
        return this;
};

Vector.normalize = function(v) {
        return Vector.divide(v, v.magnitude());
};

Vector.prototype.divide = function(scalar) {
    this.x /= scalar;
    this.y /= scalar;
    return this;
};

Vector.divide = function(v, scalar) {
    return new Vector(v.x / scalar, v.y / scalar);
};

Vector.prototype.multiply = function(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
};

Vector.multiply = function(v, scalar) {
    return new Vector(v.x * scalar, v.y * scalar);
};

Vector.dot = function(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
};

Vector.prototype.dot = function(v2) {
        return this.x * v2.x + this.y * v2.y;
};

Vector.prototype.rotate = function(radians) {
    var sin = Math.sin(radians);
    var cos = Math.cos(radians);
    this.x = this.x * cos - this.y * sin;
    this.y = this.x * sin + this.y * cos;
    return this;
}

Vector.rotate = function(v, radians) {
    var sin = Math.sin(radians);
    var cos = Math.cos(radians);
    var x = v.x * cos - v.y * sin;
    var y = v.x * sin + v.y * cos;
    
    return new Vector(x, y);
}   

//Create a new vector that is v1 projected onto v2
Vector.project = function(v1, v2) {

    let v3 = Vector.normalize(v2);
    let v1v2Dot = Vector.dot(v1, v3);

    v3.multiply(v1v2Dot);
    
    return v3;

};

//Project self onto v2
Vector.prototype.project = function(v2) {
    // let v3 = Vector.normalize(v2);
    // let v1v2Dot = Vector.dot(this, v3);
    // let v2Dot = Vector.dot(v2, v2);

    // this.x = v1v2Dot / v2Dot * this.x;
    // this.y = v1v2Dot / v2Dot * this.y;
    // return this;

}