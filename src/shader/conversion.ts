module Fayde.WebGL {
    nullstone.registerTypeConverter(VertexShader, (value: any): any => {
        if (!value)
            return value;
        if (value instanceof VertexShader)
            return value;
        var shader = new VertexShader();
        fillShader(shader, value);
        return shader;


    });
    nullstone.registerTypeConverter(FragmentShader, (value: any): any => {
        if (!value)
            return value;
        if (value instanceof FragmentShader)
            return value;
        var shader = new FragmentShader();
        fillShader(shader, value);
        return shader;
    });

    function fillShader(shader: ShaderBase, value: any) {
        if (value instanceof ShaderBase) {
            shader.Source = value.Source;
        } else if (value instanceof Uri) {
            shader.Uri = value;
        } else if (typeof value === "string") {
            shader.Uri = new Uri(value);
        }
    }
}