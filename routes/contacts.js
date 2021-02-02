const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

const User = require("../models/User");
const Contact = require("../models/Contact");

// @route   GET api/contacts
// @desc    Get all users contacts
// @acess   Private
router.get("/", auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/contacts
// @desc    Add new contact
// @acess   Private
router.post(
  "/",
  [auth, [check("name", "Name is required")]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, type } = req.body;
    try {
      const newContact = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id,
      });
      const contact = await newContact.save();
      res.json(contact);
    } catch (err) {}
  }
);
module.exports = router;

// @route   PUT api/contacts/:id
// @desc    Update contact
// @acess   Private
router.put("/:id", auth, async (req, res) => {
  let setContact = await Contact.findById(req.params.id);
  if (!setContact) {
    res.send("Something wrong");
  }
  const { name, email, phone, type } = req.body;
  try {
    setContact.name = name;
    setContact.email = email;
    setContact.phone = phone;
    setContact.type = type;
    const contact = await setContact.save();
    res.json(contact);
  } catch (error) {}
});

// @route   DELETE api/contacts/:id
// @desc    Delete contact
// @acess   Private
router.delete("/:id", auth, async (req, res) => {
  let contact = await Contact.findById(req.params.id);
  if (!contact) return res.status(404).json({});

  await Contact.findByIdAndDelete(req.params.id, function (err) {
    if (err) console.log(err);
    res.json();
    console.log("Successful deletion");
  });
});
