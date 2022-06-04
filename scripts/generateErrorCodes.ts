import fs from "fs";
import path from "path";
import prettier from "prettier";
import { errorMessages } from "../src/errorCodes";

const messageMd = Object.entries(errorMessages)
	.map(([code, message]) => `### ${code}\n\n${message}`)
	.join("\n\n");

const template = fs.readFileSync(
	path.join(__dirname, "ERROR_CODES-template.md"),
	"utf-8",
);

const md = template.replace("%ERROR_MESSAGES%", messageMd);

const formatted = prettier.format(md, {
	parser: "markdown",
	useTabs: true,
	proseWrap: "always",
});

fs.writeFileSync(path.join(__dirname, "../ERROR_CODES.md"), formatted, "utf-8");
