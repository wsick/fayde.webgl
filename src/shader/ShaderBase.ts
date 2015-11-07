module Fayde.WebGL {
    import ShapeArrangePipeDef = minerva.shapes.shape.arrange.ShapeArrangePipeDef;
    enum LoadStatus {
        NotLoaded = 0,
        Loaded = 1,
        LoadFailed = 2,
        Loading = 3,
    }

    export class ShaderBase extends DependencyObject implements IShader {
        static SourceProperty = DependencyProperty.Register("Source", () => String, ShaderBase, undefined, (d: ShaderBase, args) => d.OnSourceChanged(args.OldValue, args.NewValue));
        static UriProperty = DependencyProperty.Register("Uri", () => Uri, ShaderBase, undefined, (d: ShaderBase, args) => d.OnUriChanged(args.OldValue, args.NewValue));
        static IsLoadedProperty = DependencyProperty.Register("IsLoaded", () => Boolean, ShaderBase, false);
        Source: string;
        Uri: Uri;
        IsLoaded: boolean;

        protected $shader: WebGLShader = null;
        private $loadStatus = LoadStatus.NotLoaded;
        private $loadErr = null;
        private $compiled = false;

        protected OnSourceChanged(oldSource: string, newSource: string) {
            this.$compiled = false;
            if (this.$loadStatus !== LoadStatus.Loading) {
                this.SetCurrentValue(ShaderBase.UriProperty, undefined);
            }
            if (!newSource) {
                this.$loadStatus = LoadStatus.NotLoaded;
                this.SetCurrentValue(ShaderBase.IsLoadedProperty, false);
            } else {
                this.$loadStatus = LoadStatus.Loaded;
                this.SetCurrentValue(ShaderBase.IsLoadedProperty, true);
            }
        }

        protected OnUriChanged(oldUri: Uri, newUri: Uri) {
            this.$compiled = false;
            if (!newUri)
                return;
            this.SetCurrentValue(ShaderBase.SourceProperty, undefined);
        }

        load(forceLoad?: boolean): Promise<IShader> {
            if (forceLoad === true)
                this.SetCurrentValue(ShaderBase.SourceProperty, undefined);

            if (this.$loadStatus === LoadStatus.Loaded)
                return Promise.resolve(this);
            if (this.$loadStatus === LoadStatus.LoadFailed)
                return Promise.reject<IShader>(this.$loadErr);

            var uri = this.Uri;
            if (Uri.isNullOrEmpty(uri))
                return Promise.reject<IShader>("Cannot load shader if no Uri is specified.");

            this.$loadStatus = LoadStatus.Loading;
            this.$loadErr = null;
            return new Promise<IShader>((resolve, reject) => {
                (<any>require)(['text!' + this.Uri], (src) => {
                    this.SetCurrentValue(ShaderBase.SourceProperty, src);
                    resolve(this);
                }, (err) => {
                    this.$loadStatus = LoadStatus.LoadFailed;
                    reject(this.$loadErr = err);
                });
            });
        }

        compile(gl: WebGLRenderingContext): boolean {
            if (!!this.$compiled)
                return true;
            var src = this.Source;
            if (!src)
                return false;
            var shader = this.$shader = gl.createShader(this.getType(gl));
            gl.shaderSource(shader, src);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error("An error occurred compiling the shaders.", gl.getShaderInfoLog(shader));
                throw new Error("An error occurred compiling the shaders.");
            }
            this.$compiled = true;
            return true;
        }

        use(gl: WebGLRenderingContext, program: WebGLProgram) {
            gl.attachShader(program, this.$shader);
        }

        protected getType(gl: WebGLRenderingContext): number {
            return -1;
        }
    }
    Fayde.Markup.Content(ShaderBase, ShaderBase.SourceProperty);
}