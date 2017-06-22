Player
    RigidBody 
        Path
            Edges
                Vectors

Tile
    image?
    rigidBody?
        Path
            Edges
                Vectors


Tileset
    tiles: tile

Map
    layers: {
        ground: {
            tiles: []
        }
    }

Game 
    tileset: tileset
    map: map
    actors: []