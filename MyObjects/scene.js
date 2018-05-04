Pillar = function Pillar(name, position, size, color) {
    this.name = name;
    this.position = position || [0,0,0];
    this.size = size || 1.0;
    this.color = color || [.7,.8,.9];
    var cube2 = position.slice();
    cube2[1] += 1;
    var cube3 = position.slice();
    cube3[1] += 2;
    var pyramid = position.slice();
    pyramid[1] += 2.5;
    grobjects.push(new Cube(this.name,this.position,this.size, this.color) );
    grobjects.push(new Cube(this.name,cube2,this.size, this.color) );
    grobjects.push(new Cube(this.name,cube3,this.size, this.color) );
    grobjects.push(new Pyramid(this.name,pyramid,this.size, this.color) );
};

XWall = function Wall(name, position, size, color) {
    this.name = name;
    this.position = position || [0,0,0];
    this.size = size || 1.0;
    this.color = color || [.7,.8,.9];
    var cube1 = position.slice();
    cube1[0] += 1;
    var cube2 = position.slice();
    cube2[0] += 2;
    var cube3 = position.slice();
    cube3[0] += 3;
    grobjects.push(new Cube(this.name,cube1,this.size, this.color) );
    grobjects.push(new Cube(this.name,cube2,this.size, this.color) );
    grobjects.push(new Cube(this.name,cube3,this.size, this.color) );
    var cube4 = cube1.slice();
    var cube5 = cube2.slice();
    var cube6 = cube3.slice();
    cube4[1] += 1;
    cube5[1] += 1;
    cube6[1] += 1;
    grobjects.push(new Cube(this.name,cube4,this.size, this.color) );
    grobjects.push(new Cube(this.name,cube5,this.size, this.color) );
    grobjects.push(new Cube(this.name,cube6,this.size, this.color) );
    var cube7 = cube4.slice();
    var cube8 = cube4.slice();
    var cube9 = cube5.slice();
    var cube10 = cube5.slice();
    var cube11 = cube6.slice();
    var cube12 = cube6.slice();
    var cube13 = cube6.slice();
    cube7[1] += .5;
    cube7[0] -= .5;
    cube8[1] += .35;
    cube9[1] += .5;
    cube9[0]  -= .5;
    cube10[1] += .35;
    cube11[1] += .5;
    cube11[0] -= .5;
    cube12[1] += .35;
    cube13[1] += .5;
    cube13[0] += .5;

    grobjects.push(new Cube(this.name,cube7,.5, this.color) );
    grobjects.push(new Cube(this.name,cube8,.5, this.color) );
    grobjects.push(new Cube(this.name,cube9,.5, this.color) );
    grobjects.push(new Cube(this.name,cube10,.5, this.color) );
    grobjects.push(new Cube(this.name,cube11,.5, this.color) );
    grobjects.push(new Cube(this.name,cube12,.5, this.color) );
    grobjects.push(new Cube(this.name,cube13,.5, this.color) );

};

ZWall = function Wall(name, position, size, color) {
    this.name = name;
    this.position = position || [0,0,0];
    this.size = size || 1.0;
    this.color = color || [.8,.8,.9];
    var cube1 = position.slice();
    cube1[2] += 1;
    var cube2 = position.slice();
    cube2[2] += 2;
    var cube3 = position.slice();
    cube3[2] += 3;
    grobjects.push(new Cube(this.name,cube1,this.size, this.color) );
    grobjects.push(new Cube(this.name,cube2,this.size, this.color) );
    grobjects.push(new Cube(this.name,cube3,this.size, this.color) );
    var cube4 = cube1.slice();
    var cube5 = cube2.slice();
    var cube6 = cube3.slice();
    cube4[1] += 1;
    cube5[1] += 1;
    cube6[1] += 1;
    grobjects.push(new Cube(this.name,cube4,this.size, this.color) );
    grobjects.push(new Cube(this.name,cube5,this.size, this.color) );
    grobjects.push(new Cube(this.name,cube6,this.size, this.color) );
    var cube7 = cube4.slice();
    var cube8 = cube4.slice();
    var cube9 = cube5.slice();
    var cube10 = cube5.slice();
    var cube11 = cube6.slice();
    var cube12 = cube6.slice();
    var cube13 = cube6.slice();
    cube7[1] += .5;
    cube7[2] -= .5;
    cube8[1] += .35;
    cube9[1] += .5;
    cube9[2]  -= .5;
    cube10[1] += .35;
    cube11[1] += .5;
    cube11[2] -= .5;
    cube12[1] += .35;
    cube13[1] += .5;
    cube13[2] += .5;

    grobjects.push(new Cube(this.name,cube7,.5, this.color) );
    grobjects.push(new Cube(this.name,cube8,.5, this.color) );
    grobjects.push(new Cube(this.name,cube9,.5, this.color) );
    grobjects.push(new Cube(this.name,cube10,.5, this.color) );
    grobjects.push(new Cube(this.name,cube11,.5, this.color) );
    grobjects.push(new Cube(this.name,cube12,.5, this.color) );
    grobjects.push(new Cube(this.name,cube13,.5, this.color) );

};

new Pillar("pillar1",[-2,.5,4],1);
new Pillar("pillar1",[2,.5,4],1);
new XWall("wall1", [-2,.5,4],1);
new ZWall("wall2", [-2,.5,0],1);
new Pillar("pillar3",[-2,.5,0],1);
new XWall("wall3", [-2,.5,0],1);
new ZWall("wall4", [2,.5,0],1);
new Pillar("pillar3",[2,.5,0],1);


grobjects.push(new Skybox("skybox", [0,0,0],100,[1,1,1]));
grobjects.push(new Plank("plank1",[-1.5,.6,-3.7],.5));
grobjects.push(new Pyramid2("plankPyramid",[-1.2,0,-4],1));
grobjects.push(new counterweight("counterweight",[-2.7,.4,-3.7], .5));
