import basicFragment = require('text!../shaders/basic-fragment.shader');
import basicVertex = require('text!../shaders/basic-vertex.shader');
import Cube = require('./Basic/Cube');
import WebGLRenderer = Fayde.WebGL.WebGLRenderer;

// Built from tutorial:
//  https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Getting_started_with_WebGL
class BasicViewModel extends Fayde.MVVM.ViewModelBase {
    private $initialized = false;
    private $xstack: Float32Array[] = [];

    private $last: number = 0;

    private $cube = new Cube();

    onInit(pars: Fayde.IEventBindingArgs<Fayde.WebGL.WebGLInitEventArgs>) {
        var rend = pars.args.rend;
        var gl = rend.gl;
        var program = rend.program;

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        this.initShaders(gl, program);
        this.initBuffers(gl);
        this.initTextures(gl);
    }

    private initShaders(gl: WebGLRenderingContext, shaderProgram: WebGLProgram) {
        this.$cube.initShaders(gl, shaderProgram);
    }

    private initBuffers(gl: WebGLRenderingContext) {
        this.$cube.initBuffers(gl);
    }

    private initTextures(gl: WebGLRenderingContext) {
        this.$cube.initTextures(gl);
    }

    onDraw(pars: Fayde.IEventBindingArgs<Fayde.WebGL.WebGLDrawEventArgs>) {
        var rend = pars.args.rend;
        var gl = rend.gl;

        var now = Date.now();
        var delta = !this.$last ? 0 : now - this.$last;
        this.$last = now;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        var persp = mat4.createPerspective(45, rend.width / rend.height, 0.1, 100.0);
        var xform = mat4.createTranslate(-0.0, 0.0, -6.0);

        xform = this.pushMatrix(xform);
        xform = this.$cube.move(delta, xform);
        setMatrixUniforms(rend, persp, xform);
        this.$cube.draw(rend);
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

function setMatrixUniforms(rend: Fayde.WebGL.WebGLRenderer, persp: number[], xform: number[]) {
    var gl = rend.gl;
    var program  = rend.program;

    var pUniform = gl.getUniformLocation(program, "uPMatrix");
    gl.uniformMatrix4fv(pUniform, false, <Float32Array><any>persp);

    var mvUniform = gl.getUniformLocation(program, "uMVMatrix");
    gl.uniformMatrix4fv(mvUniform, false, <Float32Array><any>xform);

    var normal = mat4.create(xform);
    mat4.inverse(normal);
    mat4.transpose(normal);
    var nUniform = gl.getUniformLocation(program, "uNormalMatrix");
    gl.uniformMatrix4fv(nUniform, false, new Float32Array(normal));
}

export = BasicViewModel;