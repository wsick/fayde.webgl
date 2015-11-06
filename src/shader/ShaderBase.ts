module Fayde.WebGL {
    enum LoadStatus {
        NotLoaded = 0,
        Loaded = 1,
        LoadFailed = 2,
        Loading = 3,
    }

    export class ShaderBase extends DependencyObject implements IShader {
        static SourceProperty = DependencyProperty.Register("Source", () => String, ShaderBase, undefined, (d: ShaderBase, args) => d.OnSourceChanged(args.OldValue, args.NewValue));
        static UriProperty = DependencyProperty.Register("Uri", () => Uri, ShaderBase, undefined, (d: ShaderBase, args) => d.OnUriChanged(args.OldValue, args.NewValue));
        Source: string;
        Uri: Uri;

        protected $shader: WebGLShader = null;
        private $loadStatus = LoadStatus.NotLoaded;
        private $loadErr = null;
        private $compiled = false;

        protected OnSourceChanged(oldSource: string, newSource: string) {
            this.$compiled = false;
            if (this.$loadStatus === LoadStatus.Loading)
                return;
            this.SetCurrentValue(ShaderBase.UriProperty, undefined);
            this.$loadStatus = LoadStatus.Loaded;
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
                return Promise.reject<ShaderBase>(this.$loadErr);

            var uri = this.Uri;
            if (Uri.isNullOrEmpty(uri))
                return Promise.reject<ShaderBase>("Cannot load shader if no Uri is specified.");

            this.$loadStatus = LoadStatus.Loading;
            this.$loadErr = null;
            return new Promise<ShaderBase>((resolve, reject) => {
                (<any>require)(['text!' + this.Uri], (src) => {
                    this.SetCurrentValue(ShaderBase.SourceProperty, src);
                    this.$loadStatus = LoadStatus.Loaded;
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
            var shader = this.$shader = gl.createShader(gl.VERTEX_SHADER);
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