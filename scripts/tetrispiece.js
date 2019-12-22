class TetrisPiece {
    constructor(type, x, y, rotation) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.rotation = (rotation ? rotation : 0);
    }

    get getType () {return this.type;}
    set setType (value) {this.type = value;}

    get getX () {return this.x;}
    set setX (value) {this.x = value;}

    get getY () {return this.y;}
    set setY (value) {this.y = value;}

    get getRotation () {return this.rotation;}
    set setRotation (value) {this.rotation = value;}
}