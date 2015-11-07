module Fayde.WebGL {
    export class WebGLAttribute extends DependencyObject {
        static NameProperty = DependencyProperty.Register("Name", () => String, WebGLAttribute);
        static IndexProperty = DependencyProperty.Register("Index", () => Number, WebGLAttribute);
        Name: string;
        Index: number;

        init(rend: WebGLRenderer) {
            var index = rend.gl.getAttribLocation(rend.program, this.Name);
            if (!(index > -1)) {
                console.warn("Invalid attribute location: ", index);
                index = -1;
            } else {
                rend.gl.enableVertexAttribArray(index);
            }
            this.SetCurrentValue(WebGLAttribute.IndexProperty, index);
        }
    }
}