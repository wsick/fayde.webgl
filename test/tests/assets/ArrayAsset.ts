import Float32ArrayAsset = Fayde.WebGL.Float32ArrayAsset;
import WebGLRenderer = Fayde.WebGL.WebGLRenderer;

export function load() {
    QUnit.module("assets:ArrayAsset");

    QUnit.test("init", () => {
        var rend = new WebGLRenderer();
        if (!rend.gl) {
            console.warn("WebGL not supported.");
            ok(true);
            return;
        }
        var asset = new Float32ArrayAsset()
            .init(2, rend.gl.FLOAT, true, 0, 1)
            .fill([
                1, 0, 0,
                0, 1, 0,
                0, 0, 1,
            ])
            .load(rend);
        strictEqual(asset.size, 2);
        strictEqual(asset.type, rend.gl.FLOAT);
        strictEqual(asset.normalized, true);
        strictEqual(asset.stride, 0);
        strictEqual(asset.offset, 1);
    });
}