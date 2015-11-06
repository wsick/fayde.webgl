module Fayde.WebGL {
    export class WebGLCanvas extends FrameworkElement {
        CreateLayoutUpdater() {
            return new fayde.webgl.updater.WebGLCanvasUpdater();
        }

        static SourceProperty = DependencyProperty.Register("Source", () => WebGL.WebGLSource, WebGLCanvas, undefined, (d: WebGLCanvas, args) => d.OnSourceChanged(args.OldValue, args.NewValue));
        Source: WebGL.WebGLSource;

        Init = new nullstone.Event<WebGLInitEventArgs>();
        Draw = new nullstone.Event<WebGLDrawEventArgs>();

        constructor() {
            super();
            this.DefaultStyleKey = WebGLCanvas;
        }

        protected OnSourceChanged(oldSource: WebGL.WebGLSource, newSource: WebGL.WebGLSource) {
            if (oldSource)
                oldSource.detach();
            if (newSource) {
                newSource.attach((gl, program) => this.OnInit(gl, program),
                    (gl, program, width, height) => this.OnDraw(gl, program, width, height));
            }
        }

        protected OnInit(gl: WebGLRenderingContext, program: WebGLProgram) {
            this.Init.raise(this, new WebGLInitEventArgs(gl, program));
        }

        protected OnDraw(gl: WebGLRenderingContext, program: WebGLProgram, width: number, height: number) {
            this.Draw.raise(this, new WebGL.WebGLDrawEventArgs(gl, program, width, height));
        }
    }
    Fayde.CoreLibrary.add(WebGLCanvas);
    Fayde.Markup.Content(WebGLCanvas, WebGLCanvas.SourceProperty);

    module reactions {
        UIReaction(WebGLCanvas.SourceProperty, (upd, ov, nv, wc: WebGLCanvas) => {
            (<any>wc).OnSourceChanged(ov, nv);
        }, false);
    }
}