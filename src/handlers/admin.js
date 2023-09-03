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
    console.log(
      "🚀 ~ file: admin.js:15 ~ updateEnabledPages ~ pages:",
      pages.items
    );
    for (const page of pages.items) {
      console.log("PAGE", page);
      if (pages.items.includes(page)) {
        data.admin.pages[page] = true;
      } else {
        data.admin.pages[page] = false;
      }
    }

    saveData(data);
    res.status(200).json({ message: "Pages updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
