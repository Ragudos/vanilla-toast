import * as esbuild from "esbuild";

await esbuild.build({
    entryPoints: ["src/index.ts", "src/*.html", "src/*.css"],
    bundle: true,
    sourcemap: true,
    outdir: "build",
    logLevel: "debug",
    format: "iife",
    outExtension: {
        ".js": ".min.mjs",
        ".css": ".min.css",
    },
    minify: true,
});
