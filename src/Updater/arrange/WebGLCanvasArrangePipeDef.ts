module fayde.webgl.updater.arrange {
    export interface IInput extends minerva.core.arrange.IInput {
    }
    export interface IState extends minerva.core.arrange.IState {
    }
    export interface IOutput extends minerva.core.arrange.IOutput {
    }
    export class WebGLCanvasArrangePipeDef extends minerva.core.arrange.ArrangePipeDef {
        constructor() {
            super();
            this.replaceTapin('doOverride', tapins.doOverride)
                .replaceTapin('buildLayoutClip', tapins.buildLayoutClip);
        }
    }
}