module Fayde.WebGL {
    export class WebGLRenderer {
        gl: WebGLRenderingContext;
        program: WebGLProgram;

        get width(): number { return this.gl.canvas.width; }
        get height(): number { return this.gl.canvas.height; }

        constructor() {
            var canvas = document.createElement('canvas');
            var gl = <WebGLRenderingContext>(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
            Object.defineProperties(this, {
                "gl": {
                    value: gl,
                    writable: false
                },
                "program": {
                    value: gl.createProgram(),
                    writable: false
                }
            });
        }

        load(source: WebGLSource): WebGLRenderer {
            return this
                .initShaders(source)
                .initProgram();
        }

        resize(width: number, height: number): WebGLRenderer {
            var canvas = this.gl.canvas;
            this.gl.viewport(0, 0, width, height);
            canvas.width = width;
            canvas.height = height;
            return this;
        }

        draw(ctx: CanvasRenderingContext2D): WebGLRenderer {
            ctx.drawImage(this.gl.canvas, 0, 0);
            return this;
        }

        protected initShaders(source: WebGLSource): WebGLRenderer {
            var gl = this.gl;

            var vs = source.VertexShader;
            vs.compile(gl);
            vs.use(gl, this.program);

            var fs = source.FragmentShader;
            fs.compile(gl);
            fs.use(gl, this.program);

            return this;
        }

        protected initProgram(): WebGLRenderer {
            var gl = this.gl;
            var program = this.program;
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.warn("Could not link webgl program.", gl.getProgramInfoLog(program));
                return this;
            }
            gl.useProgram(program);
            return this;
        }
    }
}