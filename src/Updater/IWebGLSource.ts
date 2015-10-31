module fayde.webgl.updater {
    export interface IWebGLSource {
        resize(width: number, height: number);
        draw(ctx: CanvasRenderingContext2D);
    }
}