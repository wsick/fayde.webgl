class Cube {
    private $pos = vec4.init(0, 0, 0, 0);
    private $vel = vec4.init(-0.2, -0.4, 0.3, 0);
    private $angle = 0;

    private $vertbuffer: WebGLBuffer;
    private $colorbuffer: WebGLBuffer;
    private $vertindexbuffer: WebGLBuffer;
    private $vertposattr: number;
    private $vertexcolorattr: number;

    initShaders(gl: WebGLRenderingContext, shaderProgram: WebGLProgram) {
        var vertexPositionAttribute = this.$vertposattr = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(vertexPositionAttribute);

        var vertexColorAttribute = this.$vertexcolorattr = gl.getAttribLocation(shaderProgram, "aVertexColor");
        gl.enableVertexAttribArray(vertexColorAttribute);
    }

    initBuffers(gl: WebGLRenderingContext) {
        var vertices = [
            // Front face
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,
            1.0, 1.0, 1.0,
            -1.0, 1.0, 1.0,

            // Back face
            -1.0, -1.0, -1.0,
            -1.0, 1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, -1.0, -1.0,

            // Top face
            -1.0, 1.0, -1.0,
            -1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, -1.0,

            // Bottom face
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0, 1.0,
            -1.0, -1.0, 1.0,

            // Right face
            1.0, -1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, 1.0, 1.0,
            1.0, -1.0, 1.0,

            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0, 1.0,
            -1.0, 1.0, 1.0,
            -1.0, 1.0, -1.0
        ];
        var verticesBuffer = this.$vertbuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);


        var colors = [
            [1.0, 1.0, 1.0, 1.0],    // Front face: white
            [1.0, 0.0, 0.0, 1.0],    // Back face: red
            [0.0, 1.0, 0.0, 1.0],    // Top face: green
            [0.0, 0.0, 1.0, 1.0],    // Bottom face: blue
            [1.0, 1.0, 0.0, 1.0],    // Right face: yellow
            [1.0, 0.0, 1.0, 1.0]     // Left face: purple
        ];
        var generatedColors = [];
        for (var j = 0; j < 6; j++) {
            var c = colors[j];

            for (var i = 0; i < 4; i++) {
                generatedColors = generatedColors.concat(c);
            }
        }
        var colorBuffer = this.$colorbuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);


        // This array defines each face as two triangles, using the
        // indices into the vertex array to specify each triangle's
        // position.
        var cubeVertexIndices = [
            0, 1, 2, 0, 2, 3,    // front
            4, 5, 6, 4, 6, 7,    // back
            8, 9, 10, 8, 10, 11,   // top
            12, 13, 14, 12, 14, 15,   // bottom
            16, 17, 18, 16, 18, 19,   // right
            20, 21, 22, 20, 22, 23    // left
        ];
        var verticesIndexBuffer = this.$vertindexbuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, verticesIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
    }

    move(delta, xform: number[]): number[] {
        var pos = this.$pos;
        var vel = this.$vel;
        pos[0] += vel[0] * ((30 * delta) / 1000.0);
        pos[1] += vel[1] * ((30 * delta) / 1000.0);
        pos[2] += vel[2] * ((30 * delta) / 1000.0);

        if (Math.abs(pos[1]) > 2.5) {
            vel[0] = -vel[0];
            vel[1] = -vel[1];
            vel[2] = -vel[2];
        }

        this.$angle += (30 * delta) / 1000.0;
        var rotrad = this.$angle * Math.PI / 180.0;

        mat4.multiply(mat4.createRotateX(rotrad), xform, xform);
        mat4.multiply(mat4.createRotateZ(rotrad), xform, xform);
        mat4.multiply(mat4.createTranslate(pos[0], pos[1], pos[2]), xform, xform);

        return xform;
    }

    draw(gl: WebGLRenderingContext) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.$vertbuffer);
        gl.vertexAttribPointer(this.$vertposattr, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.$colorbuffer);
        gl.vertexAttribPointer(this.$vertexcolorattr, 4, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.$vertindexbuffer);
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    }
}
export = Cube;