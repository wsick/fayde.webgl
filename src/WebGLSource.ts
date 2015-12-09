/// <reference path="WebGLSourceBase" />

module Fayde.WebGL {
    export class WebGLSource extends WebGLSourceBase {
        static VertexShaderProperty = DependencyProperty.Register("VertexShader", () => VertexShader, WebGLSource, undefined, (d: WebGLSource, args) => d.OnVertexShaderChanged(args.OldValue, args.NewValue));
        static FragmentShaderProperty = DependencyProperty.Register("FragmentShader", () => FragmentShader, WebGLSource, undefined, (d: WebGLSource, args) => d.OnFragmentShaderChanged(args.OldValue, args.NewValue));
        VertexShader: VertexShader;
        FragmentShader: FragmentShader;

        protected OnVertexShaderChanged(oldShader: VertexShader, newShader: VertexShader) {
            if (newShader) {
                newShader.load()
                    .then(() => this.$tryLoad(),
                        err => console.error("Could not load vertex shader.", err));
            }
        }

        protected OnFragmentShaderChanged(oldShader: FragmentShader, newShader: FragmentShader) {
            if (newShader) {
                newShader.load()
                    .then(() => this.$tryLoad(),
                        err => console.error("Could not load fragment shader.", err));
            }
        }

        protected $tryLoad() {
            if (!!this.$loaded)
                return;
            var vs = this.VertexShader;
            var fs = this.FragmentShader;
            if (!vs || !fs || !vs.IsLoaded || !fs.IsLoaded)
                return;
            this.init(this.$gl, this.$program = this.$gl.createProgram());
            this.$loaded = true;
        }

        init(gl: WebGLRenderingContext, program: WebGLProgram) {
            var vs = this.VertexShader;
            vs.compile(gl);
            vs.use(gl, program);

            var fs = this.FragmentShader;
            fs.compile(gl);
            fs.use(gl, program);

            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.warn("Could not link webgl program.", gl.getProgramInfoLog(program));
                return;
            }
            gl.useProgram(program);
            this.$onInit && this.$onInit(this.$gl, this.$program);
        }

    }
}