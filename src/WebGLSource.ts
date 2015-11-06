module Fayde.WebGL {
    export interface IInitEvent {
        (gl: WebGLRenderingContext, program: WebGLProgram);
    }
    export interface IDrawEvent {
        (gl: WebGLRenderingContext, program: WebGLProgram, width: number, height: number);
    }

    export class WebGLSource extends DependencyObject implements fayde.webgl.updater.IWebGLSource {
        static VertexShaderProperty = DependencyProperty.Register("VertexShader", () => VertexShader, WebGLSource, undefined, (d: WebGLSource, args) => d.OnVertexShaderChanged(args.OldValue, args.NewValue));
        static FragmentShaderProperty = DependencyProperty.Register("FragmentShader", () => FragmentShader, WebGLSource, undefined, (d: WebGLSource, args) => d.OnFragmentShaderChanged(args.OldValue, args.NewValue));
        VertexShader: VertexShader;
        FragmentShader: FragmentShader;

        private $gl: WebGLRenderingContext;
        private $program: WebGLProgram;
        private $loaded = false;
        private $onInit: IInitEvent;
        private $onDraw: IDrawEvent;

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

        constructor() {
            super();
            this.$setElement(document.createElement('canvas'));
        }

        private $setElement(element: HTMLCanvasElement) {
            this.$gl = <WebGLRenderingContext>(element.getContext("webgl") || element.getContext("experimental-webgl"));
        }

        private $tryLoad() {
            if (!!this.$loaded)
                return;
            var vs = this.VertexShader;
            var fs = this.FragmentShader;
            if (!vs || !fs || !vs.IsLoaded || !fs.IsLoaded)
                return;
            this.init(this.$gl, this.$program = this.$gl.createProgram());
            this.$loaded = true;
        }

        resize(width: number, height: number) {
            var canvas = this.$gl.canvas;
            this.$gl.viewport(0, 0, width, height);
            canvas.width = width;
            canvas.height = height;
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

        draw(ctx: CanvasRenderingContext2D) {
            if (!this.$loaded)
                return;
            //TODO: Optimize clipping of gl canvas inside perspective of
            var canvas = this.$gl.canvas;
            this.$onDraw && this.$onDraw(this.$gl, this.$program, canvas.width, canvas.height);
            ctx.drawImage(canvas, 0, 0);
        }

        detach() {
            this.$onInit = null;
            this.$onDraw = null;
        }

        attach(onInit: IInitEvent, onDraw: IDrawEvent) {
            this.$onInit = onInit;
            this.$onDraw = onDraw;
        }
    }
}