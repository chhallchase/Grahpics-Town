/**
 * Created by gleicher on 10/9/15.
 */
/*
 a second example object for graphics town
 check out "simplest" first

 the counterweight is more complicated since it is designed to allow making many counterweight

 we make a constructor function that will make instances of counterweight - each one gets
 added to the grobjects list

 we need to be a little bit careful to distinguish between different kinds of initialization
 1) there are the things that can be initialized when the function is first defined
    (load time)
 2) there are things that are defined to be shared by all counterweight - these need to be defined
    by the first init (assuming that we require opengl to be ready)
 3) there are things that are to be defined for each counterweight instance
 */
var grobjects = grobjects || [];

// allow the two constructors to be "leaked" out
var counterweight = undefined;

// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
    "use strict";

    // i will use this function's scope for things that will be shared
    // across all counterweight - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined;
    var buffers = undefined;

    // constructor for counterweight
    counterweight = function counterweight(name, position, size) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.color = [.545,.27,.0745];
    }
    counterweight.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        // create the shaders once - for all counterweight
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["counterweight-vs", "counterweight-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos : { numComponents: 3, data: [

                        -.5,-.5,-.5,  .5,-.5,-.5,  .5, .5,-.5,        -.5,-.5,-.5,  .5, .5,-.5, -.5, .5,-.5,    // z = 0
                        -.5,-.5, .5,  .5,-.5, .5,  .5, .5, .5,        -.5,-.5, .5,  .5, .5, .5, -.5, .5, .5,    // z = 1
                        -.5,-.5,-.5,  .5,-.5,-.5,  .5,-.5, .5,        -.5,-.5,-.5,  .5,-.5, .5, -.5,-.5, .5,    // y = 0
                        -.5, .5,-.5,  .5, .5,-.5,  .5, .5, .5,        -.5, .5,-.5,  .5, .5, .5, -.5, .5, .5,    // y = 1
                        -.5,-.5,-.5, -.5, .5,-.5, -.5, .5, .5,        -.5,-.5,-.5, -.5, .5, .5, -.5,-.5, .5,    // x = 0
                        .5,-.5,-.5,  .5, .5,-.5,  .5, .5, .5,         .5,-.5,-.5,  .5, .5, .5,  .5,-.5, .5     // x = 1

                    ] },
                vnormal : {numComponents:3, data: [
                        0,0,-1,
                        0,0,-1,
                        0,0,-1,
                        0,0,-1,
                        0,0,-1,
                        0,0,-1,
                        0,0,1,
                        0,0,1,
                        0,0,1,
                        0,0,1,
                        0,0,1,
                        0,0,1,
                        0,-1,0,
                        0,-1,0,
                        0,-1,0,
                        0,-1,0,
                        0,-1,0,
                        0,-1,0,
                        0,1,0,
                        0,1,0,
                        0,1,0,
                        0,1,0,
                        0,1,0,
                        0,1,0,
                        -1,0,0,
                        -1,0,0,
                        -1,0,0,
                        -1,0,0,
                        -1,0,0,
                        -1,0,0,
                        1,0,0,
                        1,0,0,
                        1,0,0,
                        1,0,0,
                        1,0,0,
                        1,0,0,

                    ]}
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }

    };


    var step = .0033;
    var cubeX = 0;
    var cubeY= 0;
    var cubePos = 0;
    counterweight.prototype.draw = function(drawingState) {

        if (cubePos == 0)
            {cubeX += step;
             if (cubeX > .6)
                cubePos = 1}
        else if (cubePos == 1)
            {cubeX -= step;
                if (cubeX < 0)
                cubePos = 0;}
        // we make a model matrix to place the counterweight in the world
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        var theta = Math.abs(Math.sin(Number(drawingState.realtime)/2000.0));
        twgl.m4.rotateZ(modelM, theta, modelM);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        var moveCube = twgl.m4.multiply(modelM, twgl.m4.translation([cubeX,0,0]));
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            counterweightcolor:this.color, model: moveCube });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    counterweight.prototype.center = function(drawingState) {
        return this.position;
    }


})();

// put some objects into the scene
// normally, this would happen in a "scene description" file
// but I am putting it here, so that if you want to get
// rid of counterweight, just don't load this file.


