module runner {
    var libpath = "lib/fayde.webgl/dist/fayde.webgl";
    var testModules = [
        ".build/tests/assets/ArrayAsset",
        ".build/tests/shader/ShaderBase"
    ];

    Fayde.LoadConfigJson((config, err) => {
        if (err)
            console.warn("Error loading configuration file.", err);

        require([libpath], () => {
            require(testModules, (...modules: any[]) => {
                for (var i = 0; i < modules.length; i++) {
                    modules[i].load();
                }
                QUnit.load();
                QUnit.start();
            });
        });
    });
}