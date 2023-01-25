import process from "node:process";
import path from "node:path";
import { copyFileSync } from "node:fs";

import esbuild from "esbuild";
import builtins from "builtin-modules";

const banner = `/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/
`;

const prod = process.argv[2] === "production";

const buildOptions = {
	banner: {
		js: banner,
	},
	entryPoints: ["main.ts", "styles.css"],
	outdir: "dist",
	bundle: true,
	external: [
		"obsidian",
		"electron",
		"@codemirror/autocomplete",
		"@codemirror/collab",
		"@codemirror/commands",
		"@codemirror/language",
		"@codemirror/lint",
		"@codemirror/search",
		"@codemirror/state",
		"@codemirror/view",
		"@lezer/common",
		"@lezer/highlight",
		"@lezer/lr",
		...builtins,
	],
	format: "cjs",
	watch: !prod,
	target: "es2018",
	logLevel: "info",
	sourcemap: prod ? false : "inline",
	treeShaking: true,
};

esbuild
	.build(buildOptions)
	.catch(() => process.exit(1))
	.then(() => {
		/**
		 * If there is a new version number, copy it to the dist folder
		 */
		if (process.env.npm_new_version) {
			const manifestJsonSrc = path.join(process.cwd(), "manifest.json");
			const manifestJsonDist = path.join(
				process.cwd(),
				buildOptions.outdir,
				"manifest.json"
			);

			// Copy the manifest.json file over to the dist folder
			copyFileSync(manifestJsonSrc, manifestJsonDist);
		}
	});
