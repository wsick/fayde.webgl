import basicFragment = require('text!../shaders/basic-fragment.shader');
import basicVertex = require('text!../shaders/basic-vertex.shader');
import Cube = require('./Basic/Cube');

// Built from tutorial:
//  https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Getting_started_with_WebGL
class BasicViewModel extends Fayde.MVVM.ViewModelBase {
    private $initialized = false;
    private $program: WebGLProgram;
    private $xstack: Float32Array[] = [];

    private $last: number = 0;

    private $cube = new Cube();

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
        this.initTextures(gl);
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

        this.$cube.initShaders(gl, shaderProgram);
    }

    private initBuffers(gl: WebGLRenderingContext) {
        this.$cube.initBuffers(gl);
    }

    private initTextures(gl: WebGLRenderingContext) {
        this.$cube.initTextures(gl);
    }

    private draw(gl: WebGLRenderingContext, width: number, height: number) {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        var now = Date.now();
        var delta = !this.$last ? 0 : now - this.$last;
        this.$last = now;

        var persp = mat4.createPerspective(45, width / height, 0.1, 100.0);
        var xform = mat4.createTranslate(-0.0, 0.0, -6.0);

        xform = this.pushMatrix(xform);
        xform = this.$cube.move(delta, xform);
        setMatrixUniforms(gl, this.$program, persp, xform);
        this.$cube.draw(gl, this.$program);
        xform = this.popMatrix();
    }

    private pushMatrix(mat: number[]): number[] {
        this.$xstack.push(<Float32Array><any>mat);
        return mat4.create(mat);
    }

    private popMatrix(): number[] {
        if (this.$xstack.length > 0) {
            return <number[]><any>this.$xstack.pop();
        }
        console.error("Can't pop from empty stack.");
        return null;
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