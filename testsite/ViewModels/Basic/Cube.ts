import Float32ArrayAsset = Fayde.WebGL.Float32ArrayAsset;
import createVideo = require('./createVideo');

class Cube {
    private $angle = 0;

    private $vertices = new Float32ArrayAsset();
    private $textureCoords = new Float32ArrayAsset();
    private $vertexNormals = new Float32ArrayAsset();
    private $vertIndexBuffer: WebGLBuffer;

    private $texture: WebGLTexture;
    private $textureLoaded = false;
    private $video: HTMLVideoElement;

    initBuffers(rend: Fayde.WebGL.WebGLRenderer) {
        var gl = rend.gl;

        this.$vertices
            .init(3, gl.FLOAT, false, 0, 0)
            .fill([
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
            ])
            .load(rend);

        this.$textureCoords
            .init(2, gl.FLOAT, false, 0, 0)
            .fill([
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
            ])
            .load(rend);

        this.$vertexNormals
            .init(3, gl.FLOAT, false, 0, 0)
            .fill([
                // Front
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,

                // Back
                0.0, 0.0, -1.0,
                0.0, 0.0, -1.0,
                0.0, 0.0, -1.0,
                0.0, 0.0, -1.0,

                // Top
                0.0, 1.0, 0.0,
                0.0, 1.0, 0.0,
                0.0, 1.0, 0.0,
                0.0, 1.0, 0.0,

                // Bottom
                0.0, -1.0, 0.0,
                0.0, -1.0, 0.0,
                0.0, -1.0, 0.0,
                0.0, -1.0, 0.0,

                // Right
                1.0, 0.0, 0.0,
                1.0, 0.0, 0.0,
                1.0, 0.0, 0.0,
                1.0, 0.0, 0.0,

                // Left
                -1.0, 0.0, 0.0,
                -1.0, 0.0, 0.0,
                -1.0, 0.0, 0.0,
                -1.0, 0.0, 0.0
            ])
            .load(rend);

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
        var verticesIndexBuffer = this.$vertIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, verticesIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
    }

    initTextures(gl: WebGLRenderingContext) {
        var video = this.$video = createVideo("videos/Firefox.ogv", () => this.$textureLoaded = true);

        this.$texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.$texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }

    move(delta: number, xform: number[]): number[] {
        this.$angle += (30 * delta) / 1000.0;
        var rotrad = this.$angle * Math.PI / 180.0;

        mat4.multiply(mat4.createRotateX(rotrad), xform, xform);
        mat4.multiply(mat4.createRotateZ(rotrad), xform, xform);

        return xform;
    }

    draw(rend: Fayde.WebGL.WebGLRenderer) {
        if (!this.$textureLoaded)
            return;
        var gl = rend.gl;
        var program = rend.program;
        this.updateTexture(gl);

        rend.bindAttributes({
            "aVertexNormal": this.$vertexNormals,
            "aVertexPosition": this.$vertices,
            "aTextureCoord": this.$textureCoords
        });

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.$texture);
        gl.uniform1i(gl.getUniformLocation(program, "uSampler"), 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.$vertIndexBuffer);
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    }

    updateTexture(gl: WebGLRenderingContext) {
        gl.bindTexture(gl.TEXTURE_2D, this.$texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, <any>true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.$video);
    }
}
export = Cube;