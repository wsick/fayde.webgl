module fayde.webgl.updater {
    export interface IWebGLUpdaterAssets extends minerva.core.IUpdaterAssets, measure.IInput, arrange.IInput, render.IInput {
        source: IWebGLSource;
    }

    export class WebGLCanvasUpdater extends minerva.core.Updater {
        assets: IWebGLUpdaterAssets;

        init() {
            this.setMeasurePipe(minerva.singleton(measure.WebGLCanvasMeasurePipeDef))
                .setArrangePipe(minerva.singleton(arrange.WebGLCanvasArrangePipeDef))
                .setProcessDownPipe(minerva.singleton(minerva.controls.canvas.processdown.CanvasProcessDownPipeDef))
                .setProcessUpPipe(minerva.singleton(minerva.controls.canvas.processup.CanvasProcessUpPipeDef))
                .setRenderPipe(minerva.singleton(render.WebGLCanvasRenderPipeDef));

            var assets = this.assets;
            assets.source = null;

            super.init();
        }

        onSurfaceChanged(oldSurface: minerva.core.ISurface, newSurface: minerva.core.ISurface) {
            if (oldSurface)
                oldSurface.unhookPrerender(this);
            if (newSurface)
                newSurface.hookPrerender(this);
        }

        preRender() {
            var assets = this.assets;
            if (assets.source)
                this.invalidate();
        }

        onSizeChanged(oldSize: Size, newSize: Size) {
            super.onSizeChanged(oldSize, newSize);
            var source = this.assets.source;
            if (source)
                source.resize(newSize.width, newSize.height);
        }
    }
}