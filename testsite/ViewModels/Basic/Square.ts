class Square {
    private $pos = vec4.init(0, 0, 0, 0);
    private $vel = vec4.init(0.2, -0.4, 0.3, 0);
    private $angle = 0;

    private $vertbuffer: WebGLBuffer;
    private $colorbuffer: WebGLBuffer;
    private $vertposattr: number;
    private $vertexcolorattr: number;

    initShaders(gl: WebGLRenderingContext, shaderProgram: WebGLProgram) {
        var vertexPositionAttribute = this.$vertposattr = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(vertexPositionAttribute);

        var vertexColorAttribute = this.$vertexcolorattr = gl.getAttribLocation(shaderProgram, "aVertexColor");
        gl.enableVertexAttribArray(vertexColorAttribute);
    }

    initBuffers(gl: WebGLRenderingContext) {
        var squareVerticesBuffer = this.$vertbuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);

        var vertices = [
            1.0, 1.0, 0.0,
            -1.0, 1.0, 0.0,
            1.0, -1.0, 0.0,
            -1.0, -1.0, 0.0
        ];

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        var colors = [
            1.0, 1.0, 1.0, 1.0,    // white
            1.0, 0.0, 0.0, 1.0,    // red
            0.0, 1.0, 0.0, 1.0,    // green
            0.0, 0.0, 1.0, 1.0     // blue
        ];
        var squareVerticesColorBuffer = this.$colorbuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
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
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
}
export = Square;