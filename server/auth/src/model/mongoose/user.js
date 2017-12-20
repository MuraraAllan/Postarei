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
  fbID : String,
  fbAccessToken: String,
  fbProfilePicture: String,
  referedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }], 
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


const User = model.call(mongoose, 'User',  userSchema);

module.exports = User;
