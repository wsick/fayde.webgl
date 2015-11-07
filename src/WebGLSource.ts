module Fayde.WebGL {
    export interface IInitEvent {
        (rend: WebGLRenderer);
    }
    export interface IDrawEvent {
        (rend: WebGLRenderer);
    }

    export class WebGLSource extends DependencyObject implements fayde.webgl.updater.IWebGLSource {
        static VertexShaderProperty = DependencyProperty.Register("VertexShader", () => VertexShader, WebGLSource, undefined, (d: WebGLSource, args) => d.OnVertexShaderChanged(args.OldValue, args.NewValue));
        static FragmentShaderProperty = DependencyProperty.Register("FragmentShader", () => FragmentShader, WebGLSource, undefined, (d: WebGLSource, args) => d.OnFragmentShaderChanged(args.OldValue, args.NewValue));
        VertexShader: VertexShader;
        FragmentShader: FragmentShader;

        private $renderer = new WebGLRenderer();
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

        private $tryLoad() {
            if (!!this.$loaded)
                return;
            var vs = this.VertexShader;
            var fs = this.FragmentShader;
            if (!vs || !fs || !vs.IsLoaded || !fs.IsLoaded)
                return;

            this.$renderer.load(this);
            this.$onInit && this.$onInit(this.$renderer);
            this.$loaded = true;
        }

        resize(width: number, height: number) {
            this.$renderer.resize(width, height);
        }

        draw(ctx: CanvasRenderingContext2D) {
            if (!this.$loaded)
                return;
            //TODO: Optimize clipping of gl canvas inside perspective of
            this.$onDraw && this.$onDraw(this.$renderer);
            this.$renderer.draw(ctx);
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