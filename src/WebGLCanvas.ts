module Fayde.WebGL {
    export class WebGLCanvas extends FrameworkElement {
        CreateLayoutUpdater() {
            return new fayde.webgl.updater.WebGLCanvasUpdater();
        }

        static SourceProperty = DependencyProperty.Register("Source", () => WebGL.WebGLSource, WebGLCanvas, undefined, (d: WebGLCanvas, args) => d.OnSourceChanged(args.OldValue, args.NewValue));
        Source: WebGL.WebGLSource;

        Draw = new nullstone.Event<WebGL.WebGLDrawEventArgs>();

        constructor() {
            super();
            this.DefaultStyleKey = WebGLCanvas;
            if (!this.Source)
                this.SetCurrentValue(WebGLCanvas.SourceProperty, new WebGL.WebGLSource(document.createElement('canvas')));
        }

        protected OnSourceChanged(oldSource: WebGL.WebGLSource, newSource: WebGL.WebGLSource) {
            if (oldSource)
                oldSource.detach();
            if (newSource)
                newSource.attach((gl, width, height) => this.OnDraw(gl, width, height));
        }

        protected OnDraw(gl: WebGLRenderingContext, width: number, height: number) {
            this.Draw.raise(this, new WebGL.WebGLDrawEventArgs(gl, width, height));
        }
    }
    Fayde.CoreLibrary.add(WebGLCanvas);

    module reactions {
        UIReaction(WebGLCanvas.SourceProperty, (upd, ov, nv, wc: WebGLCanvas) => {
            (<any>wc).OnSourceChanged(ov, nv);
        }, false);
    }
}