import Edge from './Edge';
import Vector from './Vector';
import RigidBody from './RigidBody';
import tilesheet from './assets/tilesheet.png';
import tileMap from './assets/tileMap.json';

import GameObjectFactory from './GameObjectFactory';
export default function Game(document) {
    let self = this;

    let factory = new GameObjectFactory();

    self.currentHeight = 400;
    self.currentWidth = 600;

    self.tileMap = tileMap;

    self.canvas = document.createElement('canvas');
    self.canvas.width = self.currentWidth;
    self.canvas.height = self.currentHeight;

    document.body.appendChild(self.canvas);
    
    self.ctx = self.canvas.getContext('2d');
    
    self.startTimestamp = self.getTimestamp();
    self.currentTickTimestamp = self.startTimestamp;
    self.lastTickTimestamp = self.startTimestamp;
    self.numTicks = 0;
    self.tickTimestep = 16;//milliseconds
    self.keyMap = {};
    self.state = 'active';

    self.spriteSheet = null;                
    
    self.viewport = {
        position: new Vector(0, 0),
        width: 600,
        height: 400
    };


    self.player = factory.createSquareRigidBody(64, 64, 32, 32);
    // self.other = factory.createSquareRigidBody(200, 50, 64, 64);

    // self.other.boundaryEdges[0].end.y -= 40

    // self.other.boundaryEdges[1].end.y += 40
    // self.other.boundaryEdges[1].end.x += 40

    // self.player.constraintEdges[0].start.y += 40;
    // self.player.constraintEdges[0].end.y -= 40;
    // self.player.correctEdges();
    // self.player.correctEdges();
    // self.player.correctEdges();
    // self.player.correctEdges();
    // self.player.correctEdges();



}

Game.prototype.loadAssets = function() {
    let self = this;

    return new Promise(function(resolve, reject) {
        
        self.spriteSheet = new Image();
        self.spriteSheet.src = tilesheet;
        
        self.spriteSheet.addEventListener('load', function() {
            resolve();
        });
    });

}

Game.prototype.run = function() {
    let self = this;
    self.registerListeners();

    
    self.loadAssets().then(function() {
        
        self.tick();
    })
}

Game.prototype.getTimestamp = function() {
    let self = this;

    return window.performance.now();
}

Game.prototype.tick = function() {
    let self = this;

    if(self.state === 'active') {
        self.numTicks++;
        self.lastTickTimestamp = self.currentTickTimestamp;
        self.currentTickTimestamp = self.getTimestamp();

        window.requestAnimationFrame(self.tick.bind(self));

        //calculated time elapsed since last tick
        self.accumulatedSinceLastTick = self.currentTickTimestamp - self.lastTickTimestamp;

        while(self.accumulatedSinceLastTick >= 16) {
            self.accumulatedSinceLastTick--;
            self.processInput();
            self.processPhysics();
            
        }

        //Render scene
        self.clearCanvas();
        //Need to interpolate physics state based on any remaining time to smooth things out
        self.renderScene();
        self.renderUi();
    }
    
}

Game.prototype.processInput = function() {
    let self = this;

    let translation = new Vector(0, 0);

    if(self.keyMap['s']) {
        translation.y += 1;
    }

    if(self.keyMap['w']) {
        translation.y -= 1;
    }

    if(self.keyMap['a']) {
        translation.x -= 1;

    }

    if(self.keyMap['d']) {
        translation.x += 1;
    }
    
    if(translation.x != 0 || translation.y != 0) {
        self.player.translate(translation);
    }
}




Game.prototype.processNarrowPhaseCollisions = function() {
    let self = this;
    let colliding = true;
    let collisionResponseVector = null;

    var i = 0;

    let minGap = null;
    let minAxis = null;
    let minEdge = null;

    let edges = self.player.boundaryEdges.concat(self.other.boundaryEdges);


    for(var i in edges) {

        //Grab the edge we want to test
        let pEdge = edges[i];
        //Grab the axis we are going to project onto
        let axis = Edge.difference(pEdge).normalize().normal();

        
            
        //pMin/pMax are the min/max projection points on the axis for the player object
        let pMin = null;
        let pMax = null;
        
        
        //iterate over the player object
        for(var j in self.player.boundaryEdges) {
            let cEdge = self.player.boundaryEdges[j];

            let dotA = Vector.dot(cEdge.start, axis);
            let dotB = Vector.dot(cEdge.end, axis);

            if(pMin === null || dotA < pMin) {
                pMin = dotA;
            }

            if(pMin === null || dotB < pMin) {
                pMin = dotB;
            }

            if(pMax === null || dotA > pMax) {
                pMax = dotA;
            }

            if(pMax === null || dotB > pMax) {
                pMax = dotB;
            }

        }
       


        //oMin/pMax are the min/max projection points on the axis for the other object
        let oMin = null;
        let oMax = null;
        //iterate over the player object
        for(var j in self.other.boundaryEdges) {
            let cEdge = self.other.boundaryEdges[j];

            let dotA = Vector.dot(cEdge.start, axis);
            let dotB = Vector.dot(cEdge.end, axis);

            if(oMin === null || dotA < oMin) {
                oMin = dotA;
            }

            if(oMin === null || dotB < oMin) {
                oMin = dotB;
            }

            if(oMax === null || dotA > oMax) {
                oMax = dotA;
            }

            if(oMax === null || dotB > oMax) {
                oMax = dotB;
            }

        }   

        let gap = oMin - pMax;

        
        
        if(gap > 0) {
            colliding = false;
            break;
        } else {
            if(minGap == null || gap > minGap) {
                minGap = gap;
                minAxis = axis.clone();
            }
        }
        
    }

    
    if(colliding) {
        self.player.translate(minAxis.multiply(minGap));
    }
}

Game.prototype.processPhysics = function() {
    let self = this;


    //Find the tile coordinates of player

    //For each tile occupied, check if walkable

    let intersectingTiles = [];

    for(let i in self.player.vectors) {
        let v = self.player.vectors[i];
        let tX = Math.floor(v.x / self.tileMap.tilewidth);
        let tY = Math.floor(v.y / self.tileMap.tileheight);

        if(tX === -0) { tX = 0;}
        if(tY === -0) { tY = 0;}

        let index = tX + tY * self.tileMap.width;
        
    
        let tileRef = self.tileMap.layers[0].data[index] - 1;
        let tile = self.tileMap.tilesets[0].tiles[tileRef];
        if(tile) {
            
            let walkable = tile.objectgroup.properties.clip;
            
            if(!walkable) {
                //Push the tile back to the boundary of the intersecting tile
                //To do this, we need to find the shortest distance to move
                //Calculate the cart coords of the tile

                let cTx = tX * self.tileMap.tilewidth;
                let cTy = tY * self.tileMap.tileheight;


                //Calculate difference between vectors;
                let dX = v.x - cTx;
                let dY =  v.y - cTy;
                
                let midX = self.tileMap.tilewidth / 2;
                let midY = self.tileMap.tileheight / 2;


                if(Math.abs(dX) > 1) {
                    if(dX < midX) {
                        v.x = cTx;
                    } else {
                        v.x = cTx + self.tileMap.tilewidth;
                    }
                }

                if(Math.abs(dY) > 1) {
                    if(dY < midY) {
                        v.y = cTy;
                    } else {
                        v.y = cTy + self.tileMap.tileheight;
                    }   
                }
            }
        }
    }

    for(var i = 0; i < 5; i++) {
        self.player.correctEdges();
    }
}


Game.prototype.renderScene = function() {
    let self = this;
    
    let pCenter = self.player.center();
    self.viewport.position.x = pCenter.x - 264;
    self.viewport.position.y = pCenter.y - 264;

    for(let i in self.tileMap.layers) {
        let layer = self.tileMap.layers[i];
        for(let j in layer.data) {
            let tileRef = layer.data[j] - 1;
            if(tileRef >= 0) {
                let tile = self.tileMap.tilesets[0].tiles[tileRef];
                let tY = parseInt(j / 100);
                let tX = j - tY * 100;
                
                if(tY * self.tileMap.tileheight + self.tileMap.tileheight >= self.viewport.position.y && tX * self.tileMap.tilewidth + self.tileMap.tilewidth >= self.viewport.position.x) {
                    let iY= parseInt(tileRef / self.tileMap.tilesets[0].columns);
                    let iX = tileRef - iY * self.tileMap.tilesets[0].columns;
                    iY *= self.tileMap.tilesets[0].tileheight;
                    iX *= self.tileMap.tilesets[0].tilewidth;
                    self.ctx.drawImage(self.spriteSheet, iX, iY, self.tileMap.tilesets[0].tilewidth, self.tileMap.tilesets[0].tileheight, tX * self.tileMap.tilewidth - self.viewport.position.x, tY * self.tileMap.tileheight - self.viewport.position.y, self.tileMap.tilewidth, self.tileMap.tileheight);
                }
            }
        }
    }

    
    for(var i in self.player.constraintEdges) {
        
        let edge = self.player.constraintEdges[i];  
        
        self.ctx.strokeStyle = 'red';
        self.ctx.beginPath();
        self.ctx.moveTo(edge.end.x - self.viewport.position.x, edge.end.y - self.viewport.position.y);
        self.ctx.lineTo(edge.start.x - self.viewport.position.x, edge.start.y - self.viewport.position.y);
        self.ctx.closePath();
        self.ctx.stroke();

        if(i == 0) {
            self.ctx.fillStyle = 'yellow';
            self.ctx.fillRect(edge.end.x - 3  - self.viewport.position.x, edge.end.y -3  - self.viewport.position.y, 6, 6);
            self.ctx.fillStyle = 'orange';
            self.ctx.fillRect(edge.start.x - 3  - self.viewport.position.x, edge.start.y - 3  - self.viewport.position.y, 6, 6);
        }

        

    }

    // for(var i in self.other.constraintEdges) {
        
    //     let edge = self.other.constraintEdges[i];  
        
    //     self.ctx.strokeStyle = 'red';
    //     self.ctx.beginPath();
    //     self.ctx.moveTo(edge.end.x, edge.end.y);
    //     self.ctx.lineTo(edge.start.x, edge.start.y);
    //     self.ctx.closePath();
    //     self.ctx.stroke();

    //     if(i == 0) {
    //         self.ctx.fillStyle = 'yellow';
    //         self.ctx.fillRect(edge.end.x - 3, edge.end.y -3, 6, 6);
    //         self.ctx.fillStyle = 'orange';
    //         self.ctx.fillRect(edge.start.x - 3, edge.start.y - 3, 6, 6);
    //     }
    // }
}

Game.prototype.clearCanvas = function() {
    let self = this;
    self.ctx.clearRect(0,0, 600, 400);
}

Game.prototype.renderUi = function() {
    let self = this;

    self.ctx.fillStyle = "black";
    self.ctx.font = "30px Arial";
    let fps = self.numTicks / (self.currentTickTimestamp - self.startTimestamp) * 1000;
    self.ctx.fillText("FPS: " + fps.toFixed(0), 10, 50);
        self.ctx.fillStyle = "white";
    self.ctx.fillText("FPS: " + fps.toFixed(0), 9, 49);

}

Game.prototype.registerListeners = function() {
    let self = this;
    
    window.addEventListener('keydown', function(e) {
        self.keyMap[e.key] = true;
    });

    window.addEventListener('keyup', function(e) {
        delete self.keyMap[e.key];
    });
}