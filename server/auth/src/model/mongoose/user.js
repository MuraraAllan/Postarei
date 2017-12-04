const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;
const bcrypt = require('bcrypt');
const SALT_COST = 12;
mongoose.promise = global.Promise;
mongoose.mpromise = global.Promise;
//model user will be responsible to return bcrypted password 
const userSchema = new Schema({
  city: String,
  age: Number, 
  password : {
    type: String,
    required: true,
  },
  fbID : String,
  fbAccessToken: String,
  fbProfilePicture: String,
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
    validate: {
      validator: (email) => {
        return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
      }
    }
  },
});
userSchema.methods.comparePassword = function (pass) {
  return new Promise((resolve) => {   
    resolve(bcrypt.compare(pass, this.password));
  }).then((res) => res);
};

userSchema.query.byEmail = function(email) {
  return this.find({ email: email });
};

//pre save hook to convert password into hashed password
userSchema.pre('save', function (next) {
  if (this.password && this.isNew) {
    bcrypt.genSalt(SALT_COST, (err, salt) => {
      if (err) return next(err);
      bcrypt.hash(this.password, salt, (err, newPass) => {
        if (err) return next(err);
        this.password = newPass;
        next();
      });
    });
  }
});


const User = model.call(mongoose,'User',  userSchema);

module.exports = User;
