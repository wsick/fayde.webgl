module Fayde.WebGL {
    export interface IInitEvent {
        (gl: WebGLRenderingContext, program: WebGLProgram);
    }
    export interface IDrawEvent {
        (gl: WebGLRenderingContext, program: WebGLProgram, width: number, height: number);
    }

    export class WebGLSourceBase extends DependencyObject implements fayde.webgl.updater.IWebGLSource {
        protected $gl: WebGLRenderingContext;
        protected $program: WebGLProgram;
        protected $loaded = false;
        protected $onInit: IInitEvent;
        private $onDraw: IDrawEvent;

        constructor() {
            super();
            this.$setElement(document.createElement('canvas'));
            this.$tryLoad();
        }

        private $setElement(element: HTMLCanvasElement) {
            this.$gl = <WebGLRenderingContext>(element.getContext("webgl") || element.getContext("experimental-webgl"));
            this.$tryLoad();
        }

        protected $tryLoad() {
            if (!!this.$loaded)
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
            this.$onInit && this.$onInit(gl, program);
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