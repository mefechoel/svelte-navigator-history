import path from "path";
import rimraf from "rimraf";
import typescript from "rollup-plugin-typescript2";
import babel from "@rollup/plugin-babel";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";

rimraf.sync(path.join(__dirname, "public/build"));

export default {
	input: path.join(__dirname, "src/main.js"),
	output: {
		sourcemap: true,
		format: "iife",
		name: "test",
		dir: path.join(__dirname, "public/build"),
	},
	plugins: [
		nodeResolve({ browser: true }),
		commonjs(),
		typescript({
			tsconfigOverride: {
				compilerOptions: {
					declaration: false,
					target: "ESNext",
				},
			},
		}),
		replace({ "process.env.NODE_ENV": JSON.stringify("development") }),
		babel({
			babelHelpers: "bundled",
			babelrc: false,
			extensions: [".js", ".jsx", ".mjs", ".ts", ".tsx"],
			include: ["src/**", "../../src/**"],
			plugins: [
				"@babel/plugin-proposal-object-rest-spread",
				[
					"istanbul",
					{
						exclude: ["**/*.spec.js"],
						extension: [".js", ".cjs", ".mjs", ".ts", ".tsx", ".jsx"],
					},
				],
			],
			presets: [
				[
					"@babel/preset-env",
					{
						targets: [
							"last 2 Chrome versions",
							"last 2 Safari versions",
							"last 2 iOS versions",
							"last 2 Firefox versions",
							"last 2 Edge versions",
						],
					},
				],
			],
		}),
	],
};
