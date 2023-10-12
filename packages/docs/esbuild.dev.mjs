import * as esBuild from "esbuild";

// bundle react app
const ctx = await esBuild.context({
    entryPoints: ["./src/*.html", "./src/index.ts", "./src/styles/**/*.css"],
    loader: {
        ".html": "copy",
        ".svg": "file",
    },
    bundle: true,
    outdir: "dev",
    banner: {
        js: "(() => { (new EventSource(\"/esbuild\")).addEventListener('change', () => location.reload()); })();",
    },
    outExtension: {
        ".js": ".min.mjs",
        ".css": ".min.css",
    },
    logLevel: "info",
    format: "iife",
    minify: true,
});

// serve app to port @ localhost
await ctx
    .serve({
        servedir: "dev",
        port: 3000,
    })
    .then((v) => {
        console.log(`Server running on ${v.host}:${v.port}`);
    })
    .catch("Server error.");

// watch src dir for changes
await ctx.watch();
