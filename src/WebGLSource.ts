module Fayde.WebGL {
    export interface IDrawEvent {
        (gl: WebGLRenderingContext, width: number, height: number);
    }

    export class WebGLSource implements fayde.webgl.updater.IWebGLSource {
        private $gl: WebGLRenderingContext;
        private $onDraw: IDrawEvent;

        constructor(private $element: HTMLCanvasElement) {
            this.$gl = <WebGLRenderingContext>($element.getContext("webgl") || $element.getContext("experimental-webgl"));
        }

        resize(width: number, height: number) {
            var canvas = this.$element;
            canvas.width = width;
            canvas.height = height;
        }

        draw(ctx: CanvasRenderingContext2D) {
            //TODO: Optimize clipping of gl canvas inside perspective of
            var canvas = this.$element;
            this.$onDraw && this.$onDraw(this.$gl, canvas.width, canvas.height);
            ctx.drawImage(this.$element, 0, 0);
        }

        detach() {
            this.$onDraw = null;
        }

        attach(onDraw: IDrawEvent) {
            this.$onDraw = onDraw;
        }
    }
}