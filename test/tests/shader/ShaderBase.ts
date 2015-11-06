import VertexShader = Fayde.WebGL.VertexShader;

export function load() {
    QUnit.module("shader:ShaderBase");

    QUnit.asyncTest("load", () => {
        var shader = new VertexShader();
        shader.Uri = new Fayde.Uri("shaders/basic-vertex.shader");
        shader.load()
            .then((src) => {
                QUnit.start();
                notEqual(shader.Source, null);
                strictEqual(shader.Source.length, 837);
            }, (err) => {
                QUnit.start();
                ok(false, err);
            });
    });
}