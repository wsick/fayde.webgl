import basicFragment = require('text!../shaders/basic-fragment.shader');
import basicVertex = require('text!../shaders/basic-vertex.shader');

// Built from tutorial:
//  https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Getting_started_with_WebGL
class BasicViewModel extends Fayde.MVVM.ViewModelBase {
    private $initialized = false;
    private $program: WebGLProgram;
    private $vertposattr: number;
    private $vertexcolorattr: number;
    private $squarevertbuffer: WebGLBuffer;
    private $squarecolorbuffer: WebGLBuffer;

    onDraw(pars: Fayde.IEventBindingArgs<Fayde.WebGL.WebGLDrawEventArgs>) {
        var gl = pars.args.gl;
        var w = pars.args.width;
        var h = pars.args.height;
        this.tryInit(gl);
        gl.viewport(0, 0, w, h);
        this.draw(gl, w, h);
    }

    private tryInit(gl: WebGLRenderingContext) {
        if (this.$initialized)
            return;
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        this.initShaders(gl);
        this.initBuffers(gl);
        this.$initialized = true;
    }

    private initShaders(gl: WebGLRenderingContext) {
        var fragmentShader = createShader(gl, basicFragment, gl.FRAGMENT_SHADER);
        var vertexShader = createShader(gl, basicVertex, gl.VERTEX_SHADER);

        // Create the shader program
        var shaderProgram = this.$program = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        // If creating the shader program failed, alert
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Unable to initialize the shader program.");
        }

        gl.useProgram(shaderProgram);

        var vertexPositionAttribute = this.$vertposattr = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(vertexPositionAttribute);

        var vertexColorAttribute = this.$vertexcolorattr = gl.getAttribLocation(shaderProgram, "aVertexColor");
        gl.enableVertexAttribArray(vertexColorAttribute);
    }

    private initBuffers(gl: WebGLRenderingContext) {
        var squareVerticesBuffer = this.$squarevertbuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);

        var vertices = [
            1.0, 1.0, 0.0,
            -1.0, 1.0, 0.0,
            1.0, -1.0, 0.0,
            -1.0, -1.0, 0.0
        ];

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        var colors = [
            1.0,  1.0,  1.0,  1.0,    // white
            1.0,  0.0,  0.0,  1.0,    // red
            0.0,  1.0,  0.0,  1.0,    // green
            0.0,  0.0,  1.0,  1.0     // blue
        ];
        var squareVerticesColorBuffer = this.$squarecolorbuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    }

    private draw(gl: WebGLRenderingContext, width: number, height: number) {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        var persp = mat4.createPerspective(45, width / height, 0.1, 100.0);
        var xform = mat4.createTranslate(-0.0, 0.0, -6.0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.$squarevertbuffer);
        gl.vertexAttribPointer(this.$vertposattr, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.$squarecolorbuffer);
        gl.vertexAttribPointer(this.$vertexcolorattr, 4, gl.FLOAT, false, 0, 0);
        setMatrixUniforms(gl, this.$program, persp, xform);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
}

function createShader(gl: WebGLRenderingContext, content: string, type: number): WebGLShader {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, content);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("An error occurred compiling the shaders.", gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}

function setMatrixUniforms(gl: WebGLRenderingContext, program: WebGLProgram, persp: number[], xform: number[]) {
    var pUniform = gl.getUniformLocation(program, "uPMatrix");
    gl.uniformMatrix4fv(pUniform, false, <Float32Array><any>persp);

    var mvUniform = gl.getUniformLocation(program, "uMVMatrix");
    gl.uniformMatrix4fv(mvUniform, false, <Float32Array><any>xform);
}

export = BasicViewModel;