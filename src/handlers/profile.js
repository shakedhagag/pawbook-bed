import { saveData } from "../handlers/data.js";
import fs from "fs";
import path from "path";

export const editProfileDesc = async (req, res) => {
  try {
    const { data } = req;
    const { description, id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "User not found." });
    }
    if (!data.profiles[id]) {
      console.log("entered");
      data.profiles[id] = {};
    }
    data.profiles[id].description = description;

    saveData(data);
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const editProfileTitle = async (req, res) => {
  try {
    const { data } = req;
    const { title, id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "User not found." });
    }
    if (!data.profiles[id]) {
      data.profiles[id] = {};
    }
    data.profiles[id].title = title;

    saveData(data);
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProfileDesc = async (req, res) => {
  try {
    const { data } = req;
    const { id } = req.headers;
    if (!id) {
      return res.status(400).json({ error: "User not found." });
    }
    if (!data.profiles[id]) {
      data.profiles[id] = {};
    }
    const description = data.profiles[id].description;
    const title = data.profiles[id].title;

    res.status(200).json({ description, title });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const uploadDogImg = async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }
  const { data } = req;
  const { id } = req.headers;
  if (!id) {
    return res.status(400).json({ error: "User not found." });
  }
  const user = data.users[id];
  let newPath = prependBaseUrl(req.file.path);
  newPath = appendIdToUrl(newPath, id);
  user.dog_img = newPath;
  saveData(data);

  res.send("File uploaded successfully");
};

function prependBaseUrl(path) {
  const baseUrl = "http://localhost:3030/";
  return `${baseUrl}${path}`;
}

const appendIdToUrl = (url, id) => {
  const urlWithId = `${url}/${id}`;
  return urlWithId;
};

export const getDogImg = async (req, res) => {
  const { data } = req;
  const { id } = req.params;
  const { image } = req.params;
  try {
    const user = data.users[id];
    const newPath = `uploads/${image}`;
    const dogImgPath = path.resolve(newPath); // Ensure you have the absolute path

    // Extract the file extension and determine the content type
    const extname = String(path.extname(dogImgPath)).toLowerCase();
    const mimeTypes = {
      ".jpeg": "image/jpeg",
      ".jpg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
    };
    const contentType = mimeTypes[extname];

    // Read and serve the image
    fs.readFile(dogImgPath, (err, content) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.setHeader("Content-Type", contentType);
      res.setHeader("Content-Disposition", "inline"); // This ensures that the browser tries to display the image instead of downloading it
      res.status(200).send(content);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
