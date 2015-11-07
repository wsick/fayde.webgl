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
                newSource.attach((rend) => this.OnInit(rend),
                    (rend) => this.OnDraw(rend));
            }
        }

        protected OnInit(rend: WebGLRenderer) {
            this.Init.raise(this, new WebGLInitEventArgs(rend));
        }

        protected OnDraw(rend: WebGLRenderer) {
            this.Draw.raise(this, new WebGL.WebGLDrawEventArgs(rend));
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