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
                this.Draw = new nullstone.Event();
                this.DefaultStyleKey = WebGLCanvas;
                if (!this.Source)
                    this.SetCurrentValue(WebGLCanvas.SourceProperty, new WebGL.WebGLSource(document.createElement('canvas')));
            }
            WebGLCanvas.prototype.CreateLayoutUpdater = function () {
                return new fayde.webgl.updater.WebGLCanvasUpdater();
            };
            WebGLCanvas.prototype.OnSourceChanged = function (oldSource, newSource) {
                var _this = this;
                if (oldSource)
                    oldSource.detach();
                if (newSource)
                    newSource.attach(function (gl, width, height) { return _this.OnDraw(gl, width, height); });
            };
            WebGLCanvas.prototype.OnDraw = function (gl, width, height) {
                this.Draw.raise(this, new WebGL.WebGLDrawEventArgs(gl, width, height));
            };
            WebGLCanvas.SourceProperty = DependencyProperty.Register("Source", function () { return WebGL.WebGLSource; }, WebGLCanvas, undefined, function (d, args) { return d.OnSourceChanged(args.OldValue, args.NewValue); });
            return WebGLCanvas;
        })(Fayde.FrameworkElement);
        WebGL.WebGLCanvas = WebGLCanvas;
        Fayde.CoreLibrary.add(WebGLCanvas);
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
            function WebGLDrawEventArgs(gl, width, height) {
                Object.defineProperties(this, {
                    "gl": { value: gl, writable: false },
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
        var WebGLSource = (function () {
            function WebGLSource($element) {
                this.$element = $element;
                this.$gl = ($element.getContext("webgl") || $element.getContext("experimental-webgl"));
            }
            WebGLSource.prototype.resize = function (width, height) {
                var canvas = this.$element;
                canvas.width = width;
                canvas.height = height;
            };
            WebGLSource.prototype.draw = function (ctx) {
                var canvas = this.$element;
                this.$onDraw && this.$onDraw(this.$gl, canvas.width, canvas.height);
                ctx.drawImage(this.$element, 0, 0);
            };
            WebGLSource.prototype.detach = function () {
                this.$onDraw = null;
            };
            WebGLSource.prototype.attach = function (onDraw) {
                this.$onDraw = onDraw;
            };
            return WebGLSource;
        })();
        WebGL.WebGLSource = WebGLSource;
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
