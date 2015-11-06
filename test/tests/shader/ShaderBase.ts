import VertexShader = Fayde.WebGL.VertexShader;

export function load() {
    QUnit.module("shader:ShaderBase");

    QUnit.test("set Source", () => {
        var shader = new VertexShader();
        strictEqual(shader.IsLoaded, false);
        equal(shader.Source, undefined);

        shader.Source = "void main(void) { gl_Position = 0.0; }";
        strictEqual(shader.IsLoaded, true);
    });

    QUnit.asyncTest("load", () => {
        var shader = new VertexShader();
        shader.Uri = new Fayde.Uri("shaders/basic-vertex.shader");
        shader.load()
            .then(() => {
                QUnit.start();
                notEqual(shader.Source, null);
                strictEqual(shader.Source.length, 837);
                strictEqual(shader.IsLoaded, true);
            }, (err) => {
                QUnit.start();
                equal(shader.Source, null);
                strictEqual(shader.IsLoaded, false);
                ok(false, err);
            });
    });
}