module fayde.webgl.updater.measure {
    export interface IInput extends minerva.core.measure.IInput {
    }
    export interface IState extends minerva.core.measure.IState {
    }
    export interface IOutput extends minerva.core.measure.IOutput {
    }

    export class WebGLCanvasMeasurePipeDef extends minerva.core.measure.MeasurePipeDef {
        constructor() {
            super();
            this.replaceTapin('doOverride', tapins.doOverride);
        }
    }
}