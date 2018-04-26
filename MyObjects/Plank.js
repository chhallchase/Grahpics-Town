/**
 * Created by gleicher on 10/9/15.
 */
/*
 a second example object for graphics town
 check out "simplest" first

 the Plank is more complicated since it is designed to allow making many Planks

 we make a constructor function that will make instances of Planks - each one gets
 added to the grobjects list

 we need to be a little bit careful to distinguish between different kinds of initialization
 1) there are the things that can be initialized when the function is first defined
    (load time)
 2) there are things that are defined to be shared by all Planks - these need to be defined
    by the first init (assuming that we require opengl to be ready)
 3) there are things that are to be defined for each Plank instance
 */
var grobjects = grobjects || [];

// allow the two constructors to be "leaked" out
var Plank = undefined;

// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
    "use strict";

    // i will use this function's scope for things that will be shared
    // across all Planks - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined;
    var buffers = undefined;

    // constructor for Planks
    Plank = function Plank(name, position, size) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.color = [.545,.27,.0745];
    }
    Plank.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        // create the shaders once - for all Planks
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["plank-vs", "plank-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos : { numComponents: 3, data: [


                        0,0,0,
                        8,0,0,
                        0,1,0,

                        0,1,0,
                        8,1,0,
                        8,0,0,

                        0,0,0,
                        0,1,0,
                        0,1,-1,

                        0,1,-1,
                        0,0,-1,
                        0,0,0,

                        0,1,0,
                        8,1,0,
                        8,1,-1,

                        8,1,-1,
                        0,1,-1,
                        0,1,0,

                        8,0,0,
                        8,1,0,
                        8,1,-1,

                        8,1,-1,
                        8,0,-1,
                        8,0,0,

                        0,0,0,
                        0,0,-1,
                        8,0,0,

                        8,0,0,
                        8,0,-1,
                        0,0,-1,

                        0,1,-1,
                        8,1,-1,
                        0,0,-1,

                        0,0,-1,
                        8,0,-1,
                        8,1,-1

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

    Plank.prototype.draw = function(drawingState) {
        // we make a model matrix to place the Plank in the world
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        var theta = Math.abs(Math.sin(Number(drawingState.realtime)/2000.0));
        twgl.m4.rotateZ(modelM, theta, modelM);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            plankcolor:this.color, model: modelM });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    Plank.prototype.center = function(drawingState) {
        return this.position;
    }


})();

// put some objects into the scene
// normally, this would happen in a "scene description" file
// but I am putting it here, so that if you want to get
// rid of Planks, just don't load this file.


