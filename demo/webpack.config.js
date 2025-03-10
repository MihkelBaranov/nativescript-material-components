const { join, relative, resolve, sep } = require("path");

const webpack = require("webpack");
const nsWebpack = require("nativescript-dev-webpack");
const nativescriptTarget = require("nativescript-dev-webpack/nativescript-target");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { NativeScriptWorkerPlugin } = require("nativescript-worker-loader/NativeScriptWorkerPlugin");
const TerserPlugin = require("terser-webpack-plugin");
const hashSalt = Date.now().toString();

module.exports = env => {
    // Add your custom Activities, Services and other Android app components here.
    const appComponents = [
        "tns-core-modules/ui/frame",
        "tns-core-modules/ui/frame/activity",
    ];

    const platform = env && (env.android && "android" || env.ios && "ios");
    if (!platform) {
        throw new Error("You need to provide a target platform!");
    }

    const platforms = ["ios", "android"];
    const projectRoot = __dirname;

    // Default destination inside platforms/<platform>/...
    const dist = resolve(projectRoot, nsWebpack.getAppPath(platform, projectRoot));

    const {
        // The 'appPath' and 'appResourcesPath' values are fetched from
        // the nsconfig.json configuration file
        // when bundling with `tns run android|ios --bundle`.
        appPath = "app",
        appResourcesPath = "app/App_Resources",

        // You can provide the following flags when running 'tns run android|ios'
        snapshot, // --env.snapshot
        production, // --env.production
        uglify, // --env.uglify
        report, // --env.report
        sourceMap, // --env.sourceMap
        hiddenSourceMap, // --env.hiddenSourceMap
        hmr, // --env.hmr,
        unitTesting, // --env.unitTesting,
        verbose, // --env.verbose
        development, // --env.development
    } = env;
    const isAnySourceMapEnabled = !!sourceMap || !!hiddenSourceMap;
    const externals = nsWebpack.getConvertedExternals(env.externals);

    const appFullPath = resolve(projectRoot, appPath);
    const appResourcesFullPath = resolve(projectRoot, appResourcesPath);

    const entryModule = nsWebpack.getEntryModule(appFullPath, platform);
    const entryPath = `.${sep}${entryModule}.ts`;
    const entries = { bundle: entryPath };

    const tsConfigPath = resolve(projectRoot, "tsconfig.tns.json");

    const areCoreModulesExternal = Array.isArray(env.externals) && env.externals.some(e => e.indexOf("tns-core-modules") > -1);
    if (platform === "ios" && !areCoreModulesExternal) {
        entries["tns_modules/tns-core-modules/inspector_modules"] = "inspector_modules";
    };

    let sourceMapFilename = nsWebpack.getSourceMapFilename(hiddenSourceMap, __dirname, dist);

    const itemsToClean = [`${dist}/**/*`];
    if (platform === "android") {
        itemsToClean.push(`${join(projectRoot, "platforms", "android", "app", "src", "main", "assets", "snapshots")}`);
        itemsToClean.push(`${join(projectRoot, "platforms", "android", "app", "build", "configurations", "nativescript-android-snapshot")}`);
    }

    let aliases = {
        '~': appFullPath,
    };

    if (!!development) {
        const srcFullPath = resolve(projectRoot, '..', 'src');
        aliases = Object.assign(aliases, {
            '#': srcFullPath,
            'nativescript-material-core$': '#/core/core.' + platform,
            'nativescript-material-core/core': '#/core/core.' + platform,
            'nativescript-material-core/android/utils$': '#/core/android/utils',
            'nativescript-material-core/cssproperties$': '#/core/cssproperties',

            'nativescript-material-bottomsheet$': '#/bottomsheet/bottomsheet.' + platform,
            'nativescript-material-bottomsheet/vue$': '#/bottomsheet/vue/index',
            'nativescript-material-bottomsheet/bottomsheet$': '#/bottomsheet/bottomsheet.' + platform,
            '../bottomsheet$': '#/bottomsheet/bottomsheet.' + platform,

            'nativescript-material-progress$': '#/progress/progress.' + platform,
            'nativescript-material-progress/vue$': '#/progress/vue/index',
            'nativescript-material-progress/progress$': '#/progress/progress.' + platform,
            '../progress$': '#/progress/progress.' + platform,

            'nativescript-material-cardview$': '#/cardview/cardview.' + platform,
            'nativescript-material-cardview/vue$': '#/cardview/vue/index',
            'nativescript-material-cardview/cardview$': '#/cardview/cardview.' + platform,
            '../cardview$': '#/cardview/cardview.' + platform,

            'nativescript-material-slider$': '#/slider/slider.' + platform,
            'nativescript-material-slider/vue$': '#/slider/vue/index',
            'nativescript-material-slider/slider$': '#/slider/slider.' + platform,
            '../slider$': '#/slider/slider.' + platform,

            'nativescript-material-button$': '#/button/button.' + platform,
            'nativescript-material-button/vue$': '#/button/vue/index',
            'nativescript-material-button/button$': '#/button/button.' + platform,
            '../button$': '#/button/button.' + platform,

            'nativescript-material-textfield$': '#/textfield/textfield.' + platform,
            'nativescript-material-textfield/textfield$': '#/textfield/textfield.' + platform,
            'nativescript-material-textfield/textfield_cssproperties$': '#/textfield/textfield_cssproperties',
            'nativescript-material-textfield/vue$': '#/textfield/vue/index',
            '../textfield$': '#/textfield/textfield.' + platform,

            'nativescript-material-floatingactionbutton$': '#/floatingactionbutton/floatingactionbutton.' + platform,
            'nativescript-material-floatingactionbutton/vue$': '#/floatingactionbutton/vue/index',
            'nativescript-material-floatingactionbutton/floatingactionbutton$': '#/floatingactionbutton/floatingactionbutton.' + platform,
            '../floatingactionbutton$': '#/floatingactionbutton/floatingactionbutton.' + platform,

            'nativescript-material-activityindicator$': '#/activityindicator/activityindicator.' + platform,
            'nativescript-material-activityindicator/vue$': '#/activityindicator/vue/index',
            'nativescript-material-activityindicator/activityindicator$': '#/activityindicator/activityindicator.' + platform,
            '../activityindicator$': '#/activityindicator/activityindicator.' + platform,

            'nativescript-material-ripple$': '#/ripple/ripple.' + platform,
            'nativescript-material-ripple/vue$': '#/ripple/vue/index',
            'nativescript-material-ripple/ripple$': '#/ripple/ripple.' + platform,
            '../ripple$': '#/ripple/ripple.' + platform,

            'nativescript-material-dialogs$': '#/dialogs/dialogs.' + platform,
            'nativescript-material-dialogs/dialogs$': '#/dialogs/dialogs.' + platform,

            'nativescript-material-snackbar$': '#/snackbar/snackbar.' + platform,
            'nativescript-material-snackbar/snackbar$': '#/snackbar/snackbar.' + platform,
            './snackbar$': '#/snackbar/snackbar.' + platform,
        });

        console.log('alias', aliases);
    }

    nsWebpack.processAppComponents(appComponents, platform);
    const config = {
        mode: production ? "production" : "development",
        context: appFullPath,
        externals,
        watchOptions: {
            ignored: [
                appResourcesFullPath,
                // Don't watch hidden files
                "**/.*",
            ]
        },
        target: nativescriptTarget,
        entry: entries,
        output: {
            pathinfo: false,
            path: dist,
            sourceMapFilename,
            libraryTarget: "commonjs2",
            filename: "[name].js",
            globalObject: "global",
            hashSalt
        },
        resolve: {
            extensions: [".ts", ".js", ".scss", ".css"],
            // Resolve {N} system modules from tns-core-modules
            modules: [
                resolve(__dirname, "node_modules/tns-core-modules"),
                resolve(__dirname, "node_modules"),
                "node_modules/tns-core-modules",
                "node_modules",
            ],
            alias: aliases,
            // resolve symlinks to symlinked modules
            symlinks: true
        },
        resolveLoader: {
            // don't resolve symlinks to symlinked loaders
            symlinks: false
        },
        node: {
            // Disable node shims that conflict with NativeScript
            "http": false,
            "timers": false,
            "setImmediate": false,
            "fs": "empty",
            "__dirname": false,
        },
        devtool: hiddenSourceMap ? "hidden-source-map" : (sourceMap ? "inline-source-map" : "none"),
        optimization: {
            runtimeChunk: "single",
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        name: "vendor",
                        chunks: "all",
                        test: (module, chunks) => {
                            const moduleName = module.nameForCondition ? module.nameForCondition() : '';
                            return /[\\/]node_modules[\\/]/.test(moduleName) ||
                                appComponents.some(comp => comp === moduleName);

                        },
                        enforce: true,
                    },
                }
            },
            minimize: !!uglify,
            minimizer: [
                new TerserPlugin({
                    parallel: true,
                    cache: true,
                    sourceMap: isAnySourceMapEnabled,
                    terserOptions: {
                        output: {
                            comments: false,
                            semicolons: !isAnySourceMapEnabled
                        },
                        compress: {
                            // The Android SBG has problems parsing the output
                            // when these options are enabled
                            'collapse_vars': platform !== "android",
                            sequences: platform !== "android",
                        }
                    }
                })
            ],
        },
        module: {
            rules: [
                {
                    test: nsWebpack.getEntryPathRegExp(appFullPath, entryPath),
                    use: [
                        // Require all Android app components
                        platform === "android" && {
                            loader: "nativescript-dev-webpack/android-app-components-loader",
                            options: { modules: appComponents }
                        },

                        {
                            loader: "nativescript-dev-webpack/bundle-config-loader",
                            options: {
                                loadCss: !snapshot, // load the application css if in debug mode
                                unitTesting,
                                appFullPath,
                                projectRoot,
                                ignoredFiles: nsWebpack.getUserDefinedEntries(entries, platform)
                            }
                        },
                    ].filter(loader => !!loader)
                },
                
                {
                    test: /\.(ts|css|scss|html|xml)$/,
                    use: "nativescript-dev-webpack/hmr/hot-loader"
                },

                { test: /\.(html|xml)$/, use: "nativescript-dev-webpack/xml-namespace-loader" },

                {
                    test: /\.css$/,
                    use: { loader: "css-loader", options: { url: false } }
                },

                {
                    test: /\.scss$/,
                    use: [
                        { loader: "css-loader", options: { url: false } },
                        "sass-loader"
                    ]
                },

                {
                    test: /\.ts$/,
                    use: {
                        loader: "ts-loader",
                        options: {
                            configFile: tsConfigPath,
                            // https://github.com/TypeStrong/ts-loader/blob/ea2fcf925ec158d0a536d1e766adfec6567f5fb4/README.md#faster-builds
                            // https://github.com/TypeStrong/ts-loader/blob/ea2fcf925ec158d0a536d1e766adfec6567f5fb4/README.md#hot-module-replacement
                            transpileOnly: true,
                            allowTsInNodeModules: true,
                            compilerOptions: {
                                sourceMap: isAnySourceMapEnabled,
                                declaration: false
                            }
                        },
                    }
                },
            ]
        },
        plugins: [
            // Define useful constants like TNS_WEBPACK
            new webpack.DefinePlugin({
                "global.TNS_WEBPACK": "true",
                "process": "global.process",
            }),
            // Remove all files from the out dir.
            new CleanWebpackPlugin(itemsToClean, { verbose: !!verbose }),
            // Copy assets to out dir. Add your own globs as needed.
            new CopyWebpackPlugin([
                { from: { glob: "fonts/**" } },
                { from: { glob: "**/*.jpg" } },
                { from: { glob: "**/*.png" } },
            ], { ignore: [`${relative(appPath, appResourcesFullPath)}/**`] }),
            new nsWebpack.GenerateNativeScriptEntryPointsPlugin("bundle"),
            // For instructions on how to set up workers with webpack
            // check out https://github.com/nativescript/worker-loader
            new NativeScriptWorkerPlugin(),
            new nsWebpack.PlatformFSPlugin({
                platform,
                platforms,
            }),
            // Does IPC communication with the {N} CLI to notify events when running in watch mode.
            new nsWebpack.WatchStateLoggerPlugin(),
            // https://github.com/TypeStrong/ts-loader/blob/ea2fcf925ec158d0a536d1e766adfec6567f5fb4/README.md#faster-builds
            // https://github.com/TypeStrong/ts-loader/blob/ea2fcf925ec158d0a536d1e766adfec6567f5fb4/README.md#hot-module-replacement
            new ForkTsCheckerWebpackPlugin({
                tsconfig: tsConfigPath,
                async: false,
                useTypescriptIncrementalApi: true,
                memoryLimit: 4096
            })
        ],
    };

    if (report) {
        // Generate report files for bundles content
        config.plugins.push(new BundleAnalyzerPlugin({
            analyzerMode: "static",
            openAnalyzer: false,
            generateStatsFile: true,
            reportFilename: resolve(projectRoot, "report", `report.html`),
            statsFilename: resolve(projectRoot, "report", `stats.json`),
        }));
    }

    if (snapshot) {
        config.plugins.push(new nsWebpack.NativeScriptSnapshotPlugin({
            chunk: "vendor",
            requireModules: [
                "tns-core-modules/bundle-entry-points",
            ],
            projectRoot,
            webpackConfig: config,
        }));
    }

    if (hmr) {
        config.plugins.push(new webpack.HotModuleReplacementPlugin());
    }


    return config;
};
