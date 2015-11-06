import VertexShader = Fayde.WebGL.VertexShader;
import FragmentShader = Fayde.WebGL.FragmentShader;
import Uri = Fayde.Uri;

export function load() {
    QUnit.module("shader:ShaderBase");

    QUnit.test("conversion", () => {
        var shader = nullstone.convertAnyToType(new Uri("shaders/basic-vertex.shader"), VertexShader);
        ok(shader instanceof VertexShader);
        strictEqual(shader.IsLoaded, false);
        notEqual(shader.Uri, null);
        strictEqual(shader.Uri.toString(), "shaders/basic-vertex.shader");

        var shader = nullstone.convertAnyToType(new Uri("shaders/basic-fragment.shader"), FragmentShader);
        ok(shader instanceof FragmentShader);
        strictEqual(shader.IsLoaded, false);
        notEqual(shader.Uri, null);
        strictEqual(shader.Uri.toString(), "shaders/basic-fragment.shader");
    });

    QUnit.test("set Source", () => {
        var shader = new VertexShader();
        strictEqual(shader.IsLoaded, false);
        equal(shader.Source, undefined);

        shader.Source = "void main(void) { gl_Position = 0.0; }";
        strictEqual(shader.IsLoaded, true);
    });

    QUnit.asyncTest("load", () => {
        var shader = new VertexShader();
        shader.Uri = new Uri("shaders/basic-vertex.shader");
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