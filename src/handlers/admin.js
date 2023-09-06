import { saveData } from "./data.js";

export const getEnabledPages = async (req, res) => {
  try {
    const { data } = req;
    const pages = data.admin.pages;
    res.status(200).json({ pages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateEnabledPages = async (req, res) => {
  try {
    const { data } = req;
    const { pages } = req.body;

    let newPages = {};
    for (const page of pages.items) {
      newPages[page] = true;
    }
    for (const key in data.admin.pages) {
      data.admin.pages[key] = false;
    }
    data.admin.pages = {
      ...data.admin.pages,
      ...newPages,
    };

    saveData(data);
    res.status(200).json({ message: "Pages updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllUsersActivity = async (req, res) => {
  try {
    const { data } = req;
    const userActivity = data.admin.loginActivity;
    res.status(200).json({ userActivity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
