import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname } from "path";

const libopenmptContent = readFileSync("libopenmpt.worklet.js", "utf8");
const chiptune3Content = readFileSync("chiptune3.worklet.js", "utf8");

// Modify the _scriptName line
let modifiedLibopenmpt = libopenmptContent.replace(
    "var _scriptName = import.meta.url;",
    '// var _scriptName = import.meta.url; // This line is now commented out and will not be executed\nvar _scriptName = ""; // Or define as an empty string to keep the variable'
);

// Comment out the export default libopenmpt;
modifiedLibopenmpt = modifiedLibopenmpt.replace("export default libopenmpt;", "// export default libopenmpt;");

// Comment out the suppress comment
modifiedLibopenmpt = modifiedLibopenmpt.replace(
    "/** @suppress{duplicate} */ var require = createRequire(import.meta.url);",
    "//** @suppress{duplicate} */ var require = createRequire(import.meta.url);"
);

// Comment out the scriptDirectory block
modifiedLibopenmpt = modifiedLibopenmpt.replace(
    /if \(!import\.meta\.url\.startsWith\("data:"\)\) \{\s*scriptDirectory = nodePath\.dirname\(require\("url"\)\.fileURLToPath\(import\.meta\.url\)\) \+ "\/";\s*\}/s,
    '// if (!import.meta.url.startsWith("data:")) {\n//    scriptDirectory = nodePath.dirname(require("url").fileURLToPath(import.meta.url)) + "/";\n// }'
);

// Modify chiptune3 content: comment out the import
let modifiedChiptune3 = chiptune3Content.replace(
    "import libopenmptPromise from './libopenmpt.worklet.js'",
    "// import libopenmptPromise from './libopenmpt.worklet.js'"
);

// Comment out let libopenmpt;
modifiedChiptune3 = modifiedChiptune3.replace("let libopenmpt", "// let libopenmpt");

// Change libopenmptPromise() to libopenmpt()
modifiedChiptune3 = modifiedChiptune3.replace("libopenmptPromise()", "libopenmpt()");

// Combine
const combined = modifiedLibopenmpt + modifiedChiptune3;

// Ensure dist directory exists
const outputPath = "./dist/libopenmpt.worklet.js";
mkdirSync(dirname(outputPath), { recursive: true });

// Write to file
writeFileSync(outputPath, combined, "utf8");

console.log("Combined file created: " + outputPath);
