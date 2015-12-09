var Fayde;
(function (Fayde) {
    var WebGL;
    (function (WebGL) {
        WebGL.version = '0.1.0';
    })(WebGL = Fayde.WebGL || (Fayde.WebGL = {}));
})(Fayde || (Fayde = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Fayde;
(function (Fayde) {
    var WebGL;
    (function (WebGL) {
        var WebGLCanvas = (function (_super) {
            __extends(WebGLCanvas, _super);
            function WebGLCanvas() {
                _super.call(this);
                this.Init = new nullstone.Event();
                this.Draw = new nullstone.Event();
                this.DefaultStyleKey = WebGLCanvas;
            }
            WebGLCanvas.prototype.CreateLayoutUpdater = function () {
                return new fayde.webgl.updater.WebGLCanvasUpdater();
            };
            WebGLCanvas.prototype.OnSourceChanged = function (oldSource, newSource) {
                var _this = this;
                if (oldSource)
                    oldSource.detach();
                if (newSource) {
                    newSource.attach(function (gl, program) { return _this.OnInit(gl, program); }, function (gl, program, width, height) { return _this.OnDraw(gl, program, width, height); });
                }
            };
            WebGLCanvas.prototype.OnInit = function (gl, program) {
                this.Init.raise(this, new WebGL.WebGLInitEventArgs(gl, program));
            };
            WebGLCanvas.prototype.OnDraw = function (gl, program, width, height) {
                this.Draw.raise(this, new WebGL.WebGLDrawEventArgs(gl, program, width, height));
            };
            WebGLCanvas.SourceProperty = DependencyProperty.Register("Source", function () { return WebGL.WebGLSource; }, WebGLCanvas, undefined, function (d, args) { return d.OnSourceChanged(args.OldValue, args.NewValue); });
            return WebGLCanvas;
        })(Fayde.FrameworkElement);
        WebGL.WebGLCanvas = WebGLCanvas;
        Fayde.CoreLibrary.add(WebGLCanvas);
        Fayde.Markup.Content(WebGLCanvas, WebGLCanvas.SourceProperty);
        var reactions;
        (function (reactions) {
            Fayde.UIReaction(WebGLCanvas.SourceProperty, function (upd, ov, nv, wc) {
                wc.OnSourceChanged(ov, nv);
            }, false);
        })(reactions || (reactions = {}));
    })(WebGL = Fayde.WebGL || (Fayde.WebGL = {}));
})(Fayde || (Fayde = {}));
var Fayde;
(function (Fayde) {
    var WebGL;
    (function (WebGL) {
        var WebGLDrawEventArgs = (function () {
            function WebGLDrawEventArgs(gl, program, width, height) {
                Object.defineProperties(this, {
                    "gl": { value: gl, writable: false },
                    "program": { value: program, writable: false },
                    "width": { value: width, writable: false },
                    "height": { value: height, writable: false }
                });
            }
            return WebGLDrawEventArgs;
        })();
        WebGL.WebGLDrawEventArgs = WebGLDrawEventArgs;
    })(WebGL = Fayde.WebGL || (Fayde.WebGL = {}));
})(Fayde || (Fayde = {}));
var Fayde;
(function (Fayde) {
    var WebGL;
    (function (WebGL) {
        var WebGLInitEventArgs = (function () {
            function WebGLInitEventArgs(gl, program) {
                Object.defineProperties(this, {
                    "gl": { value: gl, writable: false },
                    "program": { value: program, writable: false }
                });
            }
            return WebGLInitEventArgs;
        })();
        WebGL.WebGLInitEventArgs = WebGLInitEventArgs;
    })(WebGL = Fayde.WebGL || (Fayde.WebGL = {}));
})(Fayde || (Fayde = {}));
var Fayde;
(function (Fayde) {
    var WebGL;
    (function (WebGL) {
        var WebGLSource = (function (_super) {
            __extends(WebGLSource, _super);
            function WebGLSource() {
                _super.call(this);
                this.$loaded = false;
                this.$setElement(document.createElement('canvas'));
            }
            WebGLSource.prototype.OnVertexShaderChanged = function (oldShader, newShader) {
                var _this = this;
                if (newShader) {
                    newShader.load()
                        .then(function () { return _this.$tryLoad(); }, function (err) { return console.error("Could not load vertex shader.", err); });
                }
            };
            WebGLSource.prototype.OnFragmentShaderChanged = function (oldShader, newShader) {
                var _this = this;
                if (newShader) {
                    newShader.load()
                        .then(function () { return _this.$tryLoad(); }, function (err) { return console.error("Could not load fragment shader.", err); });
                }
            };
            WebGLSource.prototype.$setElement = function (element) {
                this.$gl = (element.getContext("webgl") || element.getContext("experimental-webgl"));
            };
            WebGLSource.prototype.$tryLoad = function () {
                if (!!this.$loaded)
                    return;
                var vs = this.VertexShader;
                var fs = this.FragmentShader;
                if (!vs || !fs || !vs.IsLoaded || !fs.IsLoaded)
                    return;
                this.init(this.$gl, this.$program = this.$gl.createProgram());
                this.$loaded = true;
            };
            WebGLSource.prototype.resize = function (width, height) {
                var canvas = this.$gl.canvas;
                this.$gl.viewport(0, 0, width, height);
                canvas.width = width;
                canvas.height = height;
            };
            WebGLSource.prototype.init = function (gl, program) {
                var vs = this.VertexShader;
                vs.compile(gl);
                vs.use(gl, program);
                var fs = this.FragmentShader;
                fs.compile(gl);
                fs.use(gl, program);
                gl.linkProgram(program);
                if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                    console.warn("Could not link webgl program.", gl.getProgramInfoLog(program));
                    return;
                }
                gl.useProgram(program);
                this.$onInit && this.$onInit(this.$gl, this.$program);
            };
            WebGLSource.prototype.draw = function (ctx) {
                if (!this.$loaded)
                    return;
                var canvas = this.$gl.canvas;
                this.$onDraw && this.$onDraw(this.$gl, this.$program, canvas.width, canvas.height);
                ctx.drawImage(canvas, 0, 0);
            };
            WebGLSource.prototype.detach = function () {
                this.$onInit = null;
                this.$onDraw = null;
            };
            WebGLSource.prototype.attach = function (onInit, onDraw) {
                this.$onInit = onInit;
                this.$onDraw = onDraw;
            };
            WebGLSource.VertexShaderProperty = DependencyProperty.Register("VertexShader", function () { return WebGL.VertexShader; }, WebGLSource, undefined, function (d, args) { return d.OnVertexShaderChanged(args.OldValue, args.NewValue); });
            WebGLSource.FragmentShaderProperty = DependencyProperty.Register("FragmentShader", function () { return WebGL.FragmentShader; }, WebGLSource, undefined, function (d, args) { return d.OnFragmentShaderChanged(args.OldValue, args.NewValue); });
            return WebGLSource;
        })(Fayde.DependencyObject);
        WebGL.WebGLSource = WebGLSource;
    })(WebGL = Fayde.WebGL || (Fayde.WebGL = {}));
})(Fayde || (Fayde = {}));
var Fayde;
(function (Fayde) {
    var WebGL;
    (function (WebGL) {
        var LoadStatus;
        (function (LoadStatus) {
            LoadStatus[LoadStatus["NotLoaded"] = 0] = "NotLoaded";
            LoadStatus[LoadStatus["Loaded"] = 1] = "Loaded";
            LoadStatus[LoadStatus["LoadFailed"] = 2] = "LoadFailed";
            LoadStatus[LoadStatus["Loading"] = 3] = "Loading";
        })(LoadStatus || (LoadStatus = {}));
        var ShaderBase = (function (_super) {
            __extends(ShaderBase, _super);
            function ShaderBase() {
                _super.apply(this, arguments);
                this.$shader = null;
                this.$loadStatus = LoadStatus.NotLoaded;
                this.$loadErr = null;
                this.$compiled = false;
            }
            ShaderBase.prototype.OnSourceChanged = function (oldSource, newSource) {
                this.$compiled = false;
                if (this.$loadStatus !== LoadStatus.Loading) {
                    this.SetCurrentValue(ShaderBase.UriProperty, undefined);
                }
                if (!newSource) {
                    this.$loadStatus = LoadStatus.NotLoaded;
                    this.SetCurrentValue(ShaderBase.IsLoadedProperty, false);
                }
                else {
                    this.$loadStatus = LoadStatus.Loaded;
                    this.SetCurrentValue(ShaderBase.IsLoadedProperty, true);
                }
            };
            ShaderBase.prototype.OnUriChanged = function (oldUri, newUri) {
                this.$compiled = false;
                if (!newUri)
                    return;
                this.SetCurrentValue(ShaderBase.SourceProperty, undefined);
            };
            ShaderBase.prototype.load = function (forceLoad) {
                var _this = this;
                if (forceLoad === true)
                    this.SetCurrentValue(ShaderBase.SourceProperty, undefined);
                if (this.$loadStatus === LoadStatus.Loaded)
                    return Promise.resolve(this);
                if (this.$loadStatus === LoadStatus.LoadFailed)
                    return Promise.reject(this.$loadErr);
                var uri = this.Uri;
                if (Fayde.Uri.isNullOrEmpty(uri))
                    return Promise.reject("Cannot load shader if no Uri is specified.");
                this.$loadStatus = LoadStatus.Loading;
                this.$loadErr = null;
                return new Promise(function (resolve, reject) {
                    require(['text!' + _this.Uri], function (src) {
                        _this.SetCurrentValue(ShaderBase.SourceProperty, src);
                        resolve(_this);
                    }, function (err) {
                        _this.$loadStatus = LoadStatus.LoadFailed;
                        reject(_this.$loadErr = err);
                    });
                });
            };
            ShaderBase.prototype.compile = function (gl) {
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
            };
            ShaderBase.prototype.use = function (gl, program) {
                gl.attachShader(program, this.$shader);
            };
            ShaderBase.prototype.getType = function (gl) {
                return -1;
            };
            ShaderBase.SourceProperty = DependencyProperty.Register("Source", function () { return String; }, ShaderBase, undefined, function (d, args) { return d.OnSourceChanged(args.OldValue, args.NewValue); });
            ShaderBase.UriProperty = DependencyProperty.Register("Uri", function () { return Fayde.Uri; }, ShaderBase, undefined, function (d, args) { return d.OnUriChanged(args.OldValue, args.NewValue); });
            ShaderBase.IsLoadedProperty = DependencyProperty.Register("IsLoaded", function () { return Boolean; }, ShaderBase, false);
            return ShaderBase;
        })(Fayde.DependencyObject);
        WebGL.ShaderBase = ShaderBase;
        Fayde.Markup.Content(ShaderBase, ShaderBase.SourceProperty);
    })(WebGL = Fayde.WebGL || (Fayde.WebGL = {}));
})(Fayde || (Fayde = {}));
/// <reference path="ShaderBase" />
var Fayde;
(function (Fayde) {
    var WebGL;
    (function (WebGL) {
        var FragmentShader = (function (_super) {
            __extends(FragmentShader, _super);
            function FragmentShader() {
                _super.apply(this, arguments);
            }
            FragmentShader.prototype.getType = function (gl) {
                return gl.FRAGMENT_SHADER;
            };
            return FragmentShader;
        })(WebGL.ShaderBase);
        WebGL.FragmentShader = FragmentShader;
    })(WebGL = Fayde.WebGL || (Fayde.WebGL = {}));
})(Fayde || (Fayde = {}));
/// <reference path="ShaderBase" />
var Fayde;
(function (Fayde) {
    var WebGL;
    (function (WebGL) {
        var VertexShader = (function (_super) {
            __extends(VertexShader, _super);
            function VertexShader() {
                _super.apply(this, arguments);
            }
            VertexShader.prototype.getType = function (gl) {
                return gl.VERTEX_SHADER;
            };
            return VertexShader;
        })(WebGL.ShaderBase);
        WebGL.VertexShader = VertexShader;
    })(WebGL = Fayde.WebGL || (Fayde.WebGL = {}));
})(Fayde || (Fayde = {}));
/// <reference path="FragmentShader" />
/// <reference path="VertexShader" />
var Fayde;
(function (Fayde) {
    var WebGL;
    (function (WebGL) {
        nullstone.registerTypeConverter(WebGL.FragmentShader, function (value) {
            if (!value)
                return value;
            if (value instanceof WebGL.FragmentShader)
                return value;
            var shader = new WebGL.FragmentShader();
            fillShader(shader, value);
            return shader;
        });
        nullstone.registerTypeConverter(WebGL.VertexShader, function (value) {
            if (!value)
                return value;
            if (value instanceof WebGL.VertexShader)
                return value;
            var shader = new WebGL.VertexShader();
            fillShader(shader, value);
            return shader;
        });
        function fillShader(shader, value) {
            if (value instanceof WebGL.ShaderBase) {
                shader.Source = value.Source;
            }
            else if (value instanceof Fayde.Uri) {
                shader.Uri = value;
            }
            else if (typeof value === "string") {
                shader.Uri = new Fayde.Uri(value);
            }
        }
    })(WebGL = Fayde.WebGL || (Fayde.WebGL = {}));
})(Fayde || (Fayde = {}));
var fayde;
(function (fayde) {
    var webgl;
    (function (webgl) {
        var updater;
        (function (updater) {
            var WebGLCanvasUpdater = (function (_super) {
                __extends(WebGLCanvasUpdater, _super);
                function WebGLCanvasUpdater() {
                    _super.apply(this, arguments);
                }
                WebGLCanvasUpdater.prototype.init = function () {
                    this.setMeasurePipe(minerva.singleton(updater.measure.WebGLCanvasMeasurePipeDef))
                        .setArrangePipe(minerva.singleton(updater.arrange.WebGLCanvasArrangePipeDef))
                        .setProcessDownPipe(minerva.singleton(minerva.controls.canvas.processdown.CanvasProcessDownPipeDef))
                        .setProcessUpPipe(minerva.singleton(minerva.controls.canvas.processup.CanvasProcessUpPipeDef))
                        .setRenderPipe(minerva.singleton(updater.render.WebGLCanvasRenderPipeDef));
                    var assets = this.assets;
                    assets.source = null;
                    _super.prototype.init.call(this);
                };
                WebGLCanvasUpdater.prototype.onSurfaceChanged = function (oldSurface, newSurface) {
                    if (oldSurface)
                        oldSurface.unhookPrerender(this);
                    if (newSurface)
                        newSurface.hookPrerender(this);
                };
                WebGLCanvasUpdater.prototype.preRender = function () {
                    var assets = this.assets;
                    if (assets.source)
                        this.invalidate();
                };
                WebGLCanvasUpdater.prototype.onSizeChanged = function (oldSize, newSize) {
                    _super.prototype.onSizeChanged.call(this, oldSize, newSize);
                    var source = this.assets.source;
                    if (source)
                        source.resize(newSize.width, newSize.height);
                };
                return WebGLCanvasUpdater;
            })(minerva.core.Updater);
            updater.WebGLCanvasUpdater = WebGLCanvasUpdater;
        })(updater = webgl.updater || (webgl.updater = {}));
    })(webgl = fayde.webgl || (fayde.webgl = {}));
})(fayde || (fayde = {}));
var fayde;
(function (fayde) {
    var webgl;
    (function (webgl) {
        var updater;
        (function (updater) {
            var arrange;
            (function (arrange) {
                var WebGLCanvasArrangePipeDef = (function (_super) {
                    __extends(WebGLCanvasArrangePipeDef, _super);
                    function WebGLCanvasArrangePipeDef() {
                        _super.call(this);
                        this.replaceTapin('doOverride', arrange.tapins.doOverride)
                            .replaceTapin('buildLayoutClip', arrange.tapins.buildLayoutClip);
                    }
                    return WebGLCanvasArrangePipeDef;
                })(minerva.core.arrange.ArrangePipeDef);
                arrange.WebGLCanvasArrangePipeDef = WebGLCanvasArrangePipeDef;
            })(arrange = updater.arrange || (updater.arrange = {}));
        })(updater = webgl.updater || (webgl.updater = {}));
    })(webgl = fayde.webgl || (fayde.webgl = {}));
})(fayde || (fayde = {}));
var fayde;
(function (fayde) {
    var webgl;
    (function (webgl) {
        var updater;
        (function (updater) {
            var measure;
            (function (measure) {
                var WebGLCanvasMeasurePipeDef = (function (_super) {
                    __extends(WebGLCanvasMeasurePipeDef, _super);
                    function WebGLCanvasMeasurePipeDef() {
                        _super.call(this);
                        this.replaceTapin('doOverride', measure.tapins.doOverride);
                    }
                    return WebGLCanvasMeasurePipeDef;
                })(minerva.core.measure.MeasurePipeDef);
                measure.WebGLCanvasMeasurePipeDef = WebGLCanvasMeasurePipeDef;
            })(measure = updater.measure || (updater.measure = {}));
        })(updater = webgl.updater || (webgl.updater = {}));
    })(webgl = fayde.webgl || (fayde.webgl = {}));
})(fayde || (fayde = {}));
var fayde;
(function (fayde) {
    var webgl;
    (function (webgl) {
        var updater;
        (function (updater) {
            var render;
            (function (render) {
                var WebGLCanvasRenderPipeDef = (function (_super) {
                    __extends(WebGLCanvasRenderPipeDef, _super);
                    function WebGLCanvasRenderPipeDef() {
                        _super.call(this);
                        this.replaceTapin('doRender', render.tapins.doRender);
                    }
                    return WebGLCanvasRenderPipeDef;
                })(minerva.core.render.RenderPipeDef);
                render.WebGLCanvasRenderPipeDef = WebGLCanvasRenderPipeDef;
            })(render = updater.render || (updater.render = {}));
        })(updater = webgl.updater || (webgl.updater = {}));
    })(webgl = fayde.webgl || (fayde.webgl = {}));
})(fayde || (fayde = {}));
var fayde;
(function (fayde) {
    var webgl;
    (function (webgl) {
        var updater;
        (function (updater) {
            var arrange;
            (function (arrange) {
                var tapins;
                (function (tapins) {
                    function buildLayoutClip(input, state, output, tree, finalRect) {
                        var lc = output.layoutClip;
                        lc.x = lc.y = lc.width = lc.height = 0;
                        return true;
                    }
                    tapins.buildLayoutClip = buildLayoutClip;
                })(tapins = arrange.tapins || (arrange.tapins = {}));
            })(arrange = updater.arrange || (updater.arrange = {}));
        })(updater = webgl.updater || (webgl.updater = {}));
    })(webgl = fayde.webgl || (fayde.webgl = {}));
})(fayde || (fayde = {}));
var fayde;
(function (fayde) {
    var webgl;
    (function (webgl) {
        var updater;
        (function (updater) {
            var arrange;
            (function (arrange) {
                var tapins;
                (function (tapins) {
                    function doOverride(input, state, output, tree, finalRect) {
                        var cr = state.childRect;
                        Size.copyTo(state.finalSize, state.arrangedSize);
                        return true;
                    }
                    tapins.doOverride = doOverride;
                })(tapins = arrange.tapins || (arrange.tapins = {}));
            })(arrange = updater.arrange || (updater.arrange = {}));
        })(updater = webgl.updater || (webgl.updater = {}));
    })(webgl = fayde.webgl || (fayde.webgl = {}));
})(fayde || (fayde = {}));
var fayde;
(function (fayde) {
    var webgl;
    (function (webgl) {
        var updater;
        (function (updater) {
            var measure;
            (function (measure) {
                var tapins;
                (function (tapins) {
                    function doOverride(input, state, output, tree, availableSize) {
                        var available = state.availableSize;
                        var desired = output.desiredSize;
                        desired.width = desired.height = 0;
                        return true;
                    }
                    tapins.doOverride = doOverride;
                })(tapins = measure.tapins || (measure.tapins = {}));
            })(measure = updater.measure || (updater.measure = {}));
        })(updater = webgl.updater || (webgl.updater = {}));
    })(webgl = fayde.webgl || (fayde.webgl = {}));
})(fayde || (fayde = {}));
var fayde;
(function (fayde) {
    var webgl;
    (function (webgl) {
        var updater;
        (function (updater) {
            var render;
            (function (render) {
                var tapins;
                (function (tapins) {
                    function doRender(input, state, output, ctx, region, tree) {
                        var source = input.source;
                        if (!source)
                            return true;
                        ctx.save();
                        minerva.core.helpers.renderLayoutClip(ctx, input, tree);
                        source.draw(ctx.raw);
                        ctx.restore();
                        return true;
                    }
                    tapins.doRender = doRender;
                })(tapins = render.tapins || (render.tapins = {}));
            })(render = updater.render || (updater.render = {}));
        })(updater = webgl.updater || (webgl.updater = {}));
    })(webgl = fayde.webgl || (fayde.webgl = {}));
})(fayde || (fayde = {}));

//# sourceMappingURL=fayde.webgl.js.map
