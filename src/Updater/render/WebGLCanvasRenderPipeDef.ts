module fayde.webgl.updater.render {
    export interface IInput extends minerva.core.render.IInput {
        source: IWebGLSource;
    }

    export class WebGLCanvasRenderPipeDef extends minerva.core.render.RenderPipeDef {
        constructor() {
            super();
            this.replaceTapin('doRender', tapins.doRender);
        }
    }
}