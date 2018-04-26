/**
 * Created by gleicher on 10/9/15.
 */
/*
 a second example object for graphics town
 check out "simplest" first

 the cube is more complicated since it is designed to allow making many cubes

 we make a constructor function that will make instances of cubes - each one gets
 added to the grobjects list

 we need to be a little bit careful to distinguish between different kinds of initialization
 1) there are the things that can be initialized when the function is first defined
    (load time)
 2) there are things that are defined to be shared by all cubes - these need to be defined
    by the first init (assuming that we require opengl to be ready)
 3) there are things that are to be defined for each cube instance
 */
var grobjects = grobjects || [];

// allow the two constructors to be "leaked" out
var Cube = undefined;
var SpinningCube = undefined;

// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
    "use strict";

    // i will use this function's scope for things that will be shared
    // across all cubes - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined;
    var buffers = undefined;
    var texture = undefined;

    var image = new Image();
    //image.src = "data:image/jpeg;base64,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";

        // constructor for Cubes
    Cube = function Cube(name, position, size, color) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.color = color || [.7,.8,.9];
        this.texture = texture;
    };
    Cube.prototype.init = function(drawingState) {
        var gl=drawingState.gl;

        function initTextureThenDraw()
        {
            texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

            image.onload = LoadTexture;
            image.crossOrigin = "anonymous";

            image.src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/7gAOQWRvYmUAZAAAAAAA//4ANE9wdGltaXplZCBieSBKUEVHbWluaSAzLjE0LjE0LjcyNjcwODYwIDB4M2IwMzFhM2QA/9sAQwAXEBEUEQ4XFBMUGhgXGyI5JSIfHyJGMjUpOVNJV1ZRSVBPW2eDb1thfGNPUHKcdHyIjJOVk1luoa2gj6uDkJON/8AACwgBAAEAAQERAP/EABcAAQEBAQAAAAAAAAAAAAAAAAAHAQb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAA/AOoASoBVQEqAVUBKgFVASoBVQEqAVUBKgFVASoBVQEqAVUBKgFVASoBVQEqAVUBKgFVASoBVQEqAVUBK2AqoCVAANVQBKgFVASoBVQEqBqqAJUAqoCVAKqAlQCqgJUAqoCVAKqAlQCqgJUAqoCVAKqAlQCqgJUAqoCVAKqAlbBqqAACVAKqAlQCqgJWwFVASoBVQEqAVUBKgFVASoBVQEqAVUBKgFVASoBVQEqAVUBKgFVASoBVQEqAVUBKgFVASoAAVUBKgFVASoBVQEqAVUBKgFVASoBVQEqAVUBKgFVASoBVQEqAVUBKgFVASoBVQEqAVUBKgFVASoBVQEqAVUAASoBVQEqAVUBKgFVASoBVQEqAVUBKgFVASoBVQEqAVUBKgFVASoBVQEqAVUBKgFVASoBVQEqAVUBKgFVASoABqqAJUAqoCVAKqAlbAVUBKgFVASoBVQEqAVUBKgFVASoBVQEqAVUBKgFVASoBVQEqAVUBKgFVASoBVQEqAVUAASoBVQEqAVUBKgFVASoBVQEqAVUBKgFVASoBVQEqAVUBKgFVASoBVQEqAVUBKgFVASoBVQEqAVUBKgFVASoAAVUBPQFCASoBVQEqAVUBKgFVAT0BQgEqAVUBKgFVASoBVQE9AUIBKgFVASoBVQEqAVUBPQFCASoBVQEqAVUB//9k=";
            window.setTimeout(console.log("TIMEOUT"), 1000);

        }
        function LoadTexture()
        {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

            // Option 1 : Use mipmap, select interpolation mode
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

        }

        // create the shaders once - for all cubes
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["cube-vs", "cube-fs"]);
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
                    0,0,-1, 0,0,-1, 0,0,-1,
                        0,0,-1, 0,0,-1, 0,0,-1,
                    0,0,1, 0,0,1, 0,0,1,
                        0,0,1, 0,0,1, 0,0,1,
                    0,-1,0, 0,-1,0, 0,-1,0,
                        0,-1,0, 0,-1,0, 0,-1,0,
                    0,1,0, 0,1,0, 0,1,0,
                        0,1,0, 0,1,0, 0,1,0,
                    -1,0,0, -1,0,0, -1,0,0,
                        -1,0,0, -1,0,0, -1,0,0,
                    1,0,0, 1,0,0, 1,0,0,
                        1,0,0, 1,0,0, 1,0,0,
                ]}
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
            gl.useProgram(shaderProgram.program);
            initTextureThenDraw()
        }


    };
    Cube.prototype.draw = function(drawingState) {
        // we make a model matrix to place the cube in the world
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection, model: modelM, uTexture: this.texture});
        gl.bindTexture(gl.TEXTURE_2D, texture);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    Cube.prototype.center = function(drawingState) {
        return this.position;
    }


    ////////
    // constructor for Cubes
    SpinningCube = function SpinningCube(name, position, size, color, axis) {
        Cube.apply(this,arguments);
        this.axis = axis || 'X';
    }
    SpinningCube.prototype = Object.create(Cube.prototype);
    SpinningCube.prototype.draw = function(drawingState) {
        // we make a model matrix to place the cube in the world
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        var theta = Number(drawingState.realtime)/200.0;
        if (this.axis == 'X') {
            twgl.m4.rotateX(modelM, theta, modelM);
        } else if (this.axis == 'Z') {
            twgl.m4.rotateZ(modelM, theta, modelM);
        } else {
            twgl.m4.rotateY(modelM, theta, modelM);
        }
        twgl.m4.setTranslation(modelM,this.position,modelM);
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            cubecolor:this.color, model: modelM });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    SpinningCube.prototype.center = function(drawingState) {
        return this.position;
    }


})();

// put some objects into the scene
// normally, this would happen in a "scene description" file
// but I am putting it here, so that if you want to get
// rid of cubes, just don't load this file.


