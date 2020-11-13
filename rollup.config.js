import { nodeResolve as resolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import rimraf from "rimraf";
import pkg from "./package.json";

rimraf.sync("dist");

const envProd = "production";
const envDev = "development";

function createConfig({
	file,
	format,
	minify = false,
	env = null,
	emitDeclaration = false,
}) {
	const isUmd = format === "umd";
	return {
		input: "src/index.ts",
		output: {
			file,
			format,
			sourcemap: true,
			...(isUmd ? { name: "SvelteNavigatorHistory", exports: "named" } : {}),
		},
		plugins: [
			resolve(),
			commonjs(),
			typescript({
				tsconfigOverride: {
					compilerOptions: {
						declaration: emitDeclaration,
					},
				},
			}),
			env && replace({ "process.env.NODE_ENV": JSON.stringify(env) }),
			minify && terser(),
		],
	};
}

export default [
	// Only create .d.ts declaration files once
	createConfig({ file: pkg.module, format: "es", emitDeclaration: true }),
	createConfig({ file: pkg.main, format: "umd" }),
	createConfig({ file: pkg.unpkg, format: "umd", minify: true, env: envProd }),

	// Create builds with baked-in env variables, so people without access
	// to the build process config can use the library
	createConfig({
		file: "dist/history.development.mjs",
		format: "es",
		env: envDev,
	}),
	createConfig({
		file: "dist/history.production.mjs",
		format: "es",
		env: envProd,
	}),
	createConfig({
		file: "dist/history.development.umd.js",
		format: "umd",
		env: envDev,
	}),
	createConfig({
		file: "dist/history.production.umd.js",
		format: "umd",
		env: envProd,
	}),
];
