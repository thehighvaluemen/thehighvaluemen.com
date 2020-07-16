// Imports
import { createRequire } from "https://deno.land/std/node/module.ts";
import { Marked } from "https://deno.land/x/markdown/mod.ts";
import { Parser } from "https://rawcdn.githack.com/tbjgolden/deno-htmlparser2/5522f6286a17cc3857c5f1aa30e59e82968de822/htmlparser2/index.ts";
const require = createRequire(import.meta.url);
const HTMLParser = require("node-html-parser");

// Configurations
const decoder = new TextDecoder("utf-8");
const encoder = new TextEncoder();
const folder = "content";
const filenames = [
  "introduction",
  "higiene",
  "grooming",
  "style",
  "social",
	"dating",
  "skills"
];
const extension = ".md";
let generatedHTML = [];
const parser = new Parser(
  {},
  { decodeEntities: true },
);

// Get Markdown files and convert them to HTML
for (let index = 0; index < filenames.length; index++) {
  const filename = filenames[index];
  const path = `./${folder}/${filename}${extension}`;
  const markdown = decoder.decode(await Deno.readFile(path));
  const markup = Marked.parse(markdown);
  generatedHTML[index] = new TextEncoder().encode(markup);
}

// Read HTML file
const html = decoder.decode(await Deno.readFile("index.html"));

// Parse the HTML
let root = HTMLParser.parse(html);

// Get an array of nodes
let sections = root.querySelectorAll("div.content");

// Traverse those nodes and insert the parsed HTML into them
for (let index = 0; index < sections.length; index++) {
  const section = sections[index];
  const header = section.querySelector("header");
  const html = decoder.decode(generatedHTML[index]);
  section.set_content(header + html);
}

// Encode string as uint8array
const uint8array = encoder.encode(root.toString());

// Write file to disk
await Deno.writeFile("index.html", uint8array);
