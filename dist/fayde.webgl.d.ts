declare module Fayde.WebGL {
    var version: string;
}
declare module Fayde.WebGL {
    class WebGLCanvas extends FrameworkElement {
        CreateLayoutUpdater(): fayde.webgl.updater.WebGLCanvasUpdater;
        static SourceProperty: DependencyProperty;
        Source: WebGL.WebGLSource;
        Draw: nullstone.Event<WebGLDrawEventArgs>;
        constructor();
        protected OnSourceChanged(oldSource: WebGL.WebGLSource, newSource: WebGL.WebGLSource): void;
        protected OnDraw(gl: WebGLRenderingContext, width: number, height: number): void;
    }
}
declare module Fayde.WebGL {
    class WebGLDrawEventArgs implements nullstone.IEventArgs {
        gl: WebGLRenderingContext;
        width: number;
        height: number;
        constructor(gl: WebGLRenderingContext, width: number, height: number);
    }
}
declare module Fayde.WebGL {
    interface IDrawEvent {
        (gl: WebGLRenderingContext, width: number, height: number): any;
    }
    class WebGLSource implements fayde.webgl.updater.IWebGLSource {
        private $element;
        private $gl;
        private $onDraw;
        constructor($element: HTMLCanvasElement);
        resize(width: number, height: number): void;
        draw(ctx: CanvasRenderingContext2D): void;
        detach(): void;
        attach(onDraw: IDrawEvent): void;
    }
}
declare module fayde.webgl.updater {
    interface IWebGLSource {
        resize(width: number, height: number): any;
        draw(ctx: CanvasRenderingContext2D): any;
    }
}
declare module fayde.webgl.updater {
    interface IWebGLUpdaterAssets extends minerva.core.IUpdaterAssets, measure.IInput, arrange.IInput, render.IInput {
        source: IWebGLSource;
    }
    class WebGLCanvasUpdater extends minerva.core.Updater {
        assets: IWebGLUpdaterAssets;
        init(): void;
        onSurfaceChanged(oldSurface: minerva.core.ISurface, newSurface: minerva.core.ISurface): void;
        preRender(): void;
        onSizeChanged(oldSize: Size, newSize: Size): void;
    }
}
declare module fayde.webgl.updater.arrange {
    interface IInput extends minerva.core.arrange.IInput {
    }
    interface IState extends minerva.core.arrange.IState {
    }
    interface IOutput extends minerva.core.arrange.IOutput {
    }
    class WebGLCanvasArrangePipeDef extends minerva.core.arrange.ArrangePipeDef {
        constructor();
    }
}
declare module fayde.webgl.updater.measure {
    interface IInput extends minerva.core.measure.IInput {
    }
    interface IState extends minerva.core.measure.IState {
    }
    interface IOutput extends minerva.core.measure.IOutput {
    }
    class WebGLCanvasMeasurePipeDef extends minerva.core.measure.MeasurePipeDef {
        constructor();
    }
}
declare module fayde.webgl.updater.render {
    interface IInput extends minerva.core.render.IInput {
        source: IWebGLSource;
    }
    class WebGLCanvasRenderPipeDef extends minerva.core.render.RenderPipeDef {
        constructor();
    }
}
declare module fayde.webgl.updater.arrange.tapins {
    function buildLayoutClip(input: IInput, state: IState, output: IOutput, tree: minerva.core.IUpdaterTree, finalRect: Rect): boolean;
}
declare module fayde.webgl.updater.arrange.tapins {
    function doOverride(input: IInput, state: IState, output: IOutput, tree: minerva.core.IUpdaterTree, finalRect: Rect): boolean;
}
declare module fayde.webgl.updater.measure.tapins {
    function doOverride(input: IInput, state: IState, output: IOutput, tree: minerva.core.IUpdaterTree, availableSize: Size): boolean;
}
declare module fayde.webgl.updater.render.tapins {
    function doRender(input: IInput, state: minerva.core.render.IState, output: minerva.core.render.IOutput, ctx: minerva.core.render.RenderContext, region: Rect, tree: minerva.core.IUpdaterTree): boolean;
}
