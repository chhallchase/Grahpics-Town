/**
 * Created by gleicher on 10/9/15.
 */
/*
 a second example object for graphics town
 check out "simplest" first

 the Wall is more complicated since it is designed to allow making many Walls

 we make a constructor function that will make instances of Walls - each one gets
 added to the grobjects list

 we need to be a little bit careful to distinguish between different kinds of initialization
 1) there are the things that can be initialized when the function is first defined
    (load time)
 2) there are things that are defined to be shared by all Walls - these need to be defined
    by the first init (assuming that we require opengl to be ready)
 3) there are things that are to be defined for each Wall instance
 */
var grobjects = grobjects || [];

// allow the two constructors to be "leaked" out
var Wall = undefined;

// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
    "use strict";

    // i will use this function's scope for things that will be shared
    // across all Walls - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined;
    var buffers = undefined;

    // constructor for Walls
    Wall = function Wall(name, position, size, color) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.color = color || [.7,.8,.9];
    }
    Wall.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        // create the shaders once - for all Walls
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["Wall-vs", "Wall-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos : { numComponents: 3, data: [
                        -1,-1,-1,  1,-1,-1,  1, 1,-1,
                        -1,-1,-1,  1, 1,-1, -1, 1,-1,    // z = 0
                        -1, 1, -1, -1,1.2,-1, -.8,1.2,-1,
                        -1, 1, -1, -.8,1,-1, -.8,1.2,-1,
                        -.8,1.1,-1, -.6,1.1,-1, -.6,1,-1,
                        -.6,1,-1, -.8,1,-1, -.8,1.1,-1,

                        -1,-1, 1,  1,-1, 1,  1, 1, 1,        -1,-1, 1,  1, 1, 1, -1, 1, 1,    // z = 1
                        -1,-1,-1,  1,-1,-1,  1,-1, 1,        -1,-1,-1,  1,-1, 1, -1,-1, 1,    // y = 0
                        -1, 1,-1,  1, 1,-1,  1, 1, 1,        -1, 1,-1,  1, 1, 1, -1, 1, 1,    // y = 1
                        -1,-1,-1, -1, 1,-1, -1, 1, 1,        -1,-1,-1, -1, 1, 1, -1,-1, 1,    // x = 0
                         1,-1,-1,  1, 1,-1,  1, 1, 1,         1,-1,-1,  1, 1, 1,  1,-1, 1     // x = 1


                    ] },
                vnormal : {numComponents:3, data: [
                        0,0,-1, 0,0,-1, 0,0,-1,
                        0,0,-1, 0,0,-1, 0,0,-1,
                        0,0,-1, 0,0,-1, 0,0,-1,
                        0,0,1, 0,0,1, 0,0,1,
                        0,0,1, 0,0,1, 0,0,1,
                        0,0,1, 0,0,1, 0,0,1,
                        0,-1,0, 0,-1,0, 0,-1,0,
                        0,-1,0, 0,-1,0, 0,-1,0,
                        0,-1,0, 0,-1,0, 0,-1,0,
                        0,1,0, 0,1,0, 0,1,0,
                        0,1,0, 0,1,0, 0,1,0,
                        0,1,0, 0,1,0, 0,1,0,
                        -1,0,0, -1,0,0, -1,0,0,
                        -1,0,0, -1,0,0, -1,0,0,
                        1,0,0, 1,0,0, 1,0,0,
                        1,0,0, 1,0,0, 1,0,0,


                    ]}
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }

    };
    Wall.prototype.draw = function(drawingState) {
        // we make a model matrix to place the Wall in the world
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            wallcolor:this.color, model: modelM });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    Wall.prototype.center = function(drawingState) {
        return this.position;
    }

    

})();

// put some objects into the scene
// normally, this would happen in a "scene description" file
// but I am putting it here, so that if you want to get
// rid of Walls, just don't load this file.


