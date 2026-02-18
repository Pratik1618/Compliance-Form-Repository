const fs = require("fs");
const path = require("path");

const BASE_DIR = path.join(__dirname, "public", "Compliance");

function getAllFiles(dir, stateName) {
  let results = [];

  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, stateName));
    } else {
      const relativePath = fullPath
        .replace(BASE_DIR, "")
        .replace(/\\/g, "/");

      results.push(`"${relativePath}"`);
    }
  });

  return results;
}

function generateMapping() {
  const states = fs.readdirSync(BASE_DIR);

  const mapping = {};

  states.forEach((state) => {
    const statePath = path.join(BASE_DIR, state);

    if (fs.statSync(statePath).isDirectory()) {
      const files = getAllFiles(statePath, state);

      mapping[state] = files;
    }
  });

  return mapping;
}

function outputJS(mapping) {
  let output = "export const stateExcelMapping = {\n";

  for (const state in mapping) {
    output += `  "${state}": [\n`;

    mapping[state].forEach((file) => {
      output += `    ${file},\n`;
    });

    output += "  ],\n";
  }

  output += "};";

  
  return output;
}

// RUN
const mapping = generateMapping();
const jsOutput = outputJS(mapping);

fs.writeFileSync("stateExcelMapping.auto.js", jsOutput);

console.log("✅ Mapping generated → stateExcelMapping.auto.js");