const Gym = require("./models/Gym"); // Assuming Gym model is already defined
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // Adjust destination folder as necessary

// Function to handle gym creation
const addGym = async (req, res) => {
  try {
    const { gymName, location, price, managerName, managerEmail, managerPassword } = req.body;
    const logo = req.file ? req.file.path : null; // Handle logo if uploaded

    const newGym = new Gym({
      gymName,
      location,
      price,
      managerName,
      managerEmail,
      managerPassword,
      logo,
    });

    await newGym.save();
    res.status(200).send({ message: "Gym added successfully", data: newGym });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Failed to add gym" });
  }
};

module.exports = {
  addGym,
};
