var grobjects = grobjects || [];

var Skybox = undefined;

(function () {
    "use strict";

    var shaderProgram = undefined;
    var buffers = undefined;

    // Skybox constructor
    Skybox = function Skybox(name, position, size, color) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.color = color || [.7,.8,.9];
    };
    Skybox.prototype.init = function(drawingState) {
        var gl = drawingState.gl;
        shaderProgram = twgl.createProgramInfo(gl, ["skybox-vs", "skybox-fs"]);
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
                        0,0,-1, 0,0,-1, 0,0,-1,     0,0,-1, 0,0,-1, 0,0,-1,
                        0,0,1, 0,0,1, 0,0,1,        0,0,1, 0,0,1, 0,0,1,
                        0,-1,0, 0,-1,0, 0,-1,0,     0,-1,0, 0,-1,0, 0,-1,0,
                        0,1,0, 0,1,0, 0,1,0,        0,1,0, 0,1,0, 0,1,0,
                        -1,0,0, -1,0,0, -1,0,0,     -1,0,0, -1,0,0, -1,0,0,
                        1,0,0, 1,0,0, 1,0,0,        1,0,0, 1,0,0, 1,0,0,
                    ]}
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl, arrays);

            var textures = gl.createTexture();
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, textures);

            var ct = 0;
                var img = new Array(6);
                var urls = [
                    "https://i.imgur.com/D1OaE5Q.png", "https://i.imgur.com/dyEY4yb.png",
                    "https://i.imgur.com/LOWpoGV.png", "https://i.imgur.com/dLqhJOM.png",
                    "https://i.imgur.com/YI8k0V6.png", "https://i.imgur.com/PFqH3ZE.png"
                ];
            var targets = [
                gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
                gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
                gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
            ];
            for (var k = 0; k < 6; k++){
                gl.texImage2D(targets[k], 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            }
                for (var i = 0; i < 6; i++) {
                    img[i] = new Image();
                    img[i].crossOrigin = "anonymous";
                    img[i].src = urls[i];
                    img[i].face = targets[i];

                    img[i].onload = function() {
                        ct++;
                        if (ct === 6) {
                            gl.activeTexture(gl.TEXTURE0);
                            gl.bindTexture(gl.TEXTURE_CUBE_MAP, textures);

                            for (var j = 0; j < 6; j++) {
                                gl.texImage2D(targets[j], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img[j]);
                                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                            }
                            gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
                        }
                    }

                }
        }
    };

    Skybox.prototype.draw = function (drawingState) {
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;

        gl.useProgram(shaderProgram.program);

        twgl.setUniforms(shaderProgram,
            {
                view: drawingState.view,
                proj: drawingState.proj,
                lightdir: drawingState.sunDirection,
                cubecolor: this.color,
                model: modelM
            });
        twgl.setBuffersAndAttributes(gl, shaderProgram, buffers);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };

    Skybox.prototype.center = function (drawingState) {
        return this.position;
    }

})();