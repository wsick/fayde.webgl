module Fayde.WebGL {
    export interface IAttributeAssetsMap {
        [name: string]: IAsset;
    }

    export class WebGLRenderer {
        gl: WebGLRenderingContext;
        program: WebGLProgram;
        private $source: WebGLSource;

        get width(): number {
            return this.gl.canvas.width;
        }

        get height(): number {
            return this.gl.canvas.height;
        }

        constructor() {
            var canvas = document.createElement('canvas');
            var gl = <WebGLRenderingContext>(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
            Object.defineProperties(this, {
                "gl": {
                    value: gl,
                    writable: false
                },
                "program": {
                    value: gl ? gl.createProgram() : null,
                    writable: false
                }
            });
        }

        resize(width: number, height: number): WebGLRenderer {
            var canvas = this.gl.canvas;
            this.gl.viewport(0, 0, width, height);
            canvas.width = width;
            canvas.height = height;
            return this;
        }

        load(source: WebGLSource): WebGLRenderer {
            this.$source = source;
            return this
                .initShaders()
                .initProgram()
                .initAttributes()
                .initUniforms();
        }

        bindAttributes(assets: IAttributeAssetsMap): WebGLRenderer {
            for (var en = this.$source.Attributes.getEnumerator(); en.moveNext();) {
                var asset = assets[en.current.Name];
                asset.bindAttribute(this, en.current);
            }
            return this;
        }

        draw(ctx: CanvasRenderingContext2D): WebGLRenderer {
            ctx.drawImage(this.gl.canvas, 0, 0);
            return this;
        }

        protected initShaders(): WebGLRenderer {
            var gl = this.gl;
            var source = this.$source;

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

        protected initAttributes(): WebGLRenderer {
            for (var en = this.$source.Attributes.getEnumerator(); en.moveNext();) {
                en.current.init(this);
            }
            return this;
        }

        protected initUniforms(): WebGLRenderer {
            return this;
        }
    }
}