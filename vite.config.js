import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl'
import cesium from 'vite-plugin-cesium';
import { resolve } from 'path'
const isCodeSandbox = 'SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env

export default defineConfig({
    root: 'src/',
    publicDir: '../static/',
    base: './',
    resolve: {
        alias: {
            "@": resolve(__dirname, "static"),
        }
    },
    server:
    {
        host: true,
        open: !isCodeSandbox // Open if it's not a CodeSandbox
    },

    build:
    {
        outDir: 'dist',
        emptyOutDir: true,
        sourcemap: false,
        rollupOptions: {
            // ...
            // input:"src/index.js"
            input: {
                main: resolve(__dirname, 'src/index.html'),
                materials: resolve(__dirname, 'src/views/12-materials/index.html'),
                Threed_text: resolve(__dirname, 'src/views/13-3d-text/index.html'),
                haunted_house: resolve(__dirname, 'src/views/17-haunted-house/index.html'),
                galaxy_generator: resolve(__dirname, 'src/views/19-galaxy-generator/index.html'),
                physics: resolve(__dirname, 'src/views/22-physics/index.html'),
                imported_models: resolve(__dirname, 'src/views/23-imported-models/index.html'),
                post_processing: resolve(__dirname, 'src/views/32-post-processing/index.html'),
                realistic_render: resolve(__dirname, 'src/views/25-realistic-render/index.html'),
                myShaders: resolve(__dirname, 'src/views/27-myShaders/index.html'),
                shader_patterns: resolve(__dirname, 'src/views/28-shader-patterns/index.html'),
                raging_sea: resolve(__dirname, 'src/views/29-raging-sea/index.html'),
                animated_galaxy: resolve(__dirname, 'src/views/30-animated-galaxy/index.html'),
                modified_materials: resolve(__dirname, 'src/views/31-modified-materials/index.html'),
                performance_tips: resolve(__dirname, 'src/views/33-performance-tips/index.html'),
                cesium_hello: resolve(__dirname, 'src/views/cesium_hello/index.html'),

                test: resolve(__dirname, 'src/views/test/index.html'),

            }
        },
    },
    plugins: [glsl(), cesium()]
})