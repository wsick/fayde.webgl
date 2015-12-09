declare module Fayde.WebGL {
    var version: string;
}
declare module Fayde.WebGL {
    class WebGLCanvas extends FrameworkElement {
        CreateLayoutUpdater(): fayde.webgl.updater.WebGLCanvasUpdater;
        static SourceProperty: DependencyProperty;
        Source: WebGL.WebGLSource;
        Init: nullstone.Event<WebGLInitEventArgs>;
        Draw: nullstone.Event<WebGLDrawEventArgs>;
        constructor();
        protected OnSourceChanged(oldSource: WebGL.WebGLSource, newSource: WebGL.WebGLSource): void;
        protected OnInit(gl: WebGLRenderingContext, program: WebGLProgram): void;
        protected OnDraw(gl: WebGLRenderingContext, program: WebGLProgram, width: number, height: number): void;
    }
}
declare module Fayde.WebGL {
    class WebGLDrawEventArgs implements nullstone.IEventArgs {
        gl: WebGLRenderingContext;
        program: WebGLProgram;
        width: number;
        height: number;
        constructor(gl: WebGLRenderingContext, program: WebGLProgram, width: number, height: number);
    }
}
declare module Fayde.WebGL {
    class WebGLInitEventArgs implements nullstone.IEventArgs {
        gl: WebGLRenderingContext;
        program: WebGLProgram;
        constructor(gl: WebGLRenderingContext, program: WebGLProgram);
    }
}
declare module Fayde.WebGL {
    interface IInitEvent {
        (gl: WebGLRenderingContext, program: WebGLProgram): any;
    }
    interface IDrawEvent {
        (gl: WebGLRenderingContext, program: WebGLProgram, width: number, height: number): any;
    }
    class WebGLSource extends DependencyObject implements fayde.webgl.updater.IWebGLSource {
        static VertexShaderProperty: DependencyProperty;
        static FragmentShaderProperty: DependencyProperty;
        VertexShader: VertexShader;
        FragmentShader: FragmentShader;
        private $gl;
        private $program;
        private $loaded;
        private $onInit;
        private $onDraw;
        protected OnVertexShaderChanged(oldShader: VertexShader, newShader: VertexShader): void;
        protected OnFragmentShaderChanged(oldShader: FragmentShader, newShader: FragmentShader): void;
        constructor();
        private $setElement(element);
        private $tryLoad();
        resize(width: number, height: number): void;
        init(gl: WebGLRenderingContext, program: WebGLProgram): void;
        draw(ctx: CanvasRenderingContext2D): void;
        detach(): void;
        attach(onInit: IInitEvent, onDraw: IDrawEvent): void;
    }
}
declare module Fayde.WebGL {
    class ShaderBase extends DependencyObject implements IShader {
        static SourceProperty: DependencyProperty;
        static UriProperty: DependencyProperty;
        static IsLoadedProperty: DependencyProperty;
        Source: string;
        Uri: Uri;
        IsLoaded: boolean;
        protected $shader: WebGLShader;
        private $loadStatus;
        private $loadErr;
        private $compiled;
        protected OnSourceChanged(oldSource: string, newSource: string): void;
        protected OnUriChanged(oldUri: Uri, newUri: Uri): void;
        load(forceLoad?: boolean): Promise<IShader>;
        compile(gl: WebGLRenderingContext): boolean;
        use(gl: WebGLRenderingContext, program: WebGLProgram): void;
        protected getType(gl: WebGLRenderingContext): number;
    }
}
declare module Fayde.WebGL {
    class FragmentShader extends ShaderBase {
        protected getType(gl: WebGLRenderingContext): number;
    }
}
declare module Fayde.WebGL {
    class VertexShader extends ShaderBase {
        protected getType(gl: WebGLRenderingContext): number;
    }
}
declare module Fayde.WebGL {
}
declare module Fayde.WebGL {
    interface IShader {
        load(forceLoad?: boolean): Promise<IShader>;
        compile(gl: WebGLRenderingContext): boolean;
        use(gl: WebGLRenderingContext, program: WebGLProgram): any;
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
