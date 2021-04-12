const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/userModel.js");
const validateUser = require("../helpers/validationUser.js");

const userController = {
  signin: async (req, res) => {
    const { email, password } = req.body;

    try {
      const existingUser = await UserModel.findOne({ email });

      if (!existingUser)
        return res.status(404).json({ message: "User doesn't exist." });

      const isPasswordCorrect = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (!isPasswordCorrect)
        return res.status(400).json({ message: "Invalid credentials." });

      const token = jwt.sign(
        { email: existingUser.email, id: existingUser._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }
      );
      res.status(200).json({ result: existingUser, token });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong." });
    }
  },
  signup: async (req, res) => {
    // console.log("object")
    const { email, firstName, lastName, password, confirmPassword } = req.body;
    
    const { error } = validateUser({email, firstName, lastName, password});
    // console.log(error)
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    

    try {
      const existingUser = await UserModel.findOne({ email });
      // console.log("exiqti", existingUser)
      if (existingUser)
        return res.status(400).json({ message: "User already exists." });

      if (password !== confirmPassword)
        return res.status(400).json({ message: "Password don't match." });

      const hashedPassword = await bcrypt.hash(password, 12);

      const result = await UserModel.create({
        email,
        password: hashedPassword,
        name: `${firstName} ${lastName}`
      });
      // console.log(result)
      const token = jwt.sign(
        { email: result.email, id: result._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }
      );
      // console.log(token)
      res.status(200).json({ result, token });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong." });
    }
  },
};

module.exports = userController;
