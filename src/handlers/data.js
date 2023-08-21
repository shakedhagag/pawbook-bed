import { createRequire } from "module"; // Bring in the ability to create the 'require' method
const require = createRequire(import.meta.url);
import fs from "fs";
import path from "path";

export const loadData = async (req, res) => {
  try {
    let data = require("../data.json");
    return data;
  } catch (err) {
    console.error("Error reading the file:", err);
    data = {}; // Default empty data
  }
};

export const saveData = (data) => {
  try {
    const dataPath = path.join("./src", "/data.json");
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 4));
  } catch (err) {
    console.error("Error writing the file:", err);
  }
};
