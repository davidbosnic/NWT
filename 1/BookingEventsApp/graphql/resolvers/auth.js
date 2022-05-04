const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');

module.exports = {
  createUser: async args => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error('User exists already.');
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        email: args.userInput.email,
        password: hashedPassword,
        firstname: args.userInput.firstname,
        lastname: args.userInput.lastname,
        address: args.userInput.address,
        city: args.userInput.city,
        phone: args.userInput.phone
      });

      const result = await user.save();

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
  user: async (args) => {
    try {
      var result = await User.findById(args.userId);
      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
  updateUser: async (args) => {
    try{

      var result = await User.findById(args.userInput._id);
      var mail = await User.where('email').equals(args.userInput.email).where('_id').ne(args.userInput._id);   //(x=>x.email == args.userInput.email && x._id != args.userInput._id)

      if(mail.length != 0)
        throw new Error("This email already exist!");

      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      result.email = args.userInput.email;
      result.password = hashedPassword;
      result.firstname = args.userInput.firstname;
      result.lastname = args.userInput.lastname;
      result.address = args.userInput.address;
      result.city = args.userInput.city;
      result.phone = args.userInput.phone;

      var res = await result.save();

      return { ...res._doc, password: null, _id: res.id };
    }
    catch (err) {
      throw err;
    }
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error('User does not exist!');
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error('Password is incorrect!');
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      'somesupersecretkey',
      {
        expiresIn: '1h'
      }
    );
    return { userId: user.id, token: token, tokenExpiration: 1 };
  }
};