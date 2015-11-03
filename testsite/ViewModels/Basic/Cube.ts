class Cube {
    private $angle = 0;

    private $vertbuffer: WebGLBuffer;
    private $colorbuffer: WebGLBuffer;
    private $vertindexbuffer: WebGLBuffer;
    private $textureBuffer: WebGLBuffer;
    private $vertNormalBuffer: WebGLBuffer;
    private $vertPosAttr: number;
    private $vertTextureAttr: number;
    private $vertNormalAttr: number;

    private $texture: WebGLTexture;
    private $textureLoaded = false;

    initShaders(gl: WebGLRenderingContext, shaderProgram: WebGLProgram) {
        gl.enableVertexAttribArray(this.$vertNormalAttr = gl.getAttribLocation(shaderProgram, "aVertexNormal"));
        gl.enableVertexAttribArray(this.$vertPosAttr = gl.getAttribLocation(shaderProgram, "aVertexPosition"));
        gl.enableVertexAttribArray(this.$vertTextureAttr = gl.getAttribLocation(shaderProgram, "aTextureCoord"));
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


        var textureCoordinates = [
            // Front
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // Back
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // Top
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // Bottom
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // Right
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            // Left
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0
        ];
        var textureBuffer = this.$textureBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);


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


        var vertexNormals = [
            // Front
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,

            // Back
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,

            // Top
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,

            // Bottom
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,

            // Right
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,

            // Left
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0
        ];
        var verticesNormalBuffer = this.$vertNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, verticesNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
    }

    initTextures(gl: WebGLRenderingContext) {
        this.$texture = gl.createTexture();
        var img = new Image();
        img.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, this.$texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D, null);
            this.$textureLoaded = true;
        };
        img.src = "textures/cube.png";
    }

    move(delta: number, xform: number[]): number[] {
        this.$angle += (30 * delta) / 1000.0;
        var rotrad = this.$angle * Math.PI / 180.0;

        mat4.multiply(mat4.createRotateX(rotrad), xform, xform);
        mat4.multiply(mat4.createRotateZ(rotrad), xform, xform);

        return xform;
    }

    draw(gl: WebGLRenderingContext, program: WebGLProgram) {
        if (!this.$textureLoaded)
            return;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.$vertbuffer);
        gl.vertexAttribPointer(this.$vertPosAttr, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.$textureBuffer);
        gl.vertexAttribPointer(this.$vertTextureAttr, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.$vertNormalBuffer);
        gl.vertexAttribPointer(this.$vertNormalAttr, 3, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.$texture);
        gl.uniform1i(gl.getUniformLocation(program, "uSampler"), 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.$vertindexbuffer);
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    }
}
export = Cube;