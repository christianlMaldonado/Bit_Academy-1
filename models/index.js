const bcrypt = require("bcryptjs");

const collection = (module.exports = {
  School: require("./schools"),
  Student: require("./students"),
  Teacher: require("./teachers"),
});

module.exports.getUserById = function (id, callback) {
  collection.findById(id, callback);
};

module.exports.getUserByEmail = function (email, callback) {
  const query = { email: email };
  collection.findOne(query, callback);
};

module.exports.addUser = function (newUser, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

module.exports.comparePassword = function (canidatePassword, hash, callback) {
  bcrypt.compare(canidatePassword, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  });
};
