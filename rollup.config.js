import { nodeResolve as resolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import rimraf from "rimraf";
import pkg from "./package.json";

rimraf.sync("dist");

function createConfig({ file, format, minify = false }) {
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
			minify &&
				replace({ "process.env.NODE_ENV": JSON.stringify("production") }),
			typescript(),
			minify && terser(),
		],
	};
}

export default [
	createConfig({ file: pkg.module, format: "es" }),
	createConfig({ file: pkg.main, format: "umd" }),
	createConfig({ file: pkg.unpkg, format: "umd", minify: true }),
];
