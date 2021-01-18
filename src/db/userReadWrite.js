// file for adding new users
const bcrypt = require("bcryptjs");
const User = require("./userSchema");
const Product = require("./productSchema");

async function addToCart(user, productId, quantity) {
  const product = await Product.findById(productId);
  const productName = product.name;
  const price = product.price;
  const totalPrice = price * quantity;

  const cart = user.cart.toObject();
  const index = cart.findIndex((cartItem) => cartItem._id == productId);

  if (index == -1) {
    cart.push({
      _id: productId,
      productName,
      quantity,
      price,
      totalPrice,
    });
  } else {
    cart[index].quantity = parseInt(cart[index].quantity) + parseInt(quantity);
    cart[index].totalPrice = parseInt(cart[index].totalPrice) + totalPrice;
  }
  user.cart = cart;
  await user.save();
}

async function addToWishlist(user, productId) {
  const product = await Product.findById(productId);
  user.wishlist.push({
    _id: productId,
    price: product.price,
    productName: product.name,
  });
}

async function deleteFromCart(user, productId, quantity) {
  var cart = user.cart.toObject();
  const index = cart.findIndex((cartItem) => cartItem._id == productId);

  cart[index].quantity = parseInt(cart[index].quantity) - parseInt(quantity);
  cart[index].totalPrice =
    parseInt(cart[index].totalPrice) -
    parseInt(quantity) * parseInt(cart[index].price);

  if (cart[index].quantity < 1) {
    cart = cart.filter((item) => item._id != cart[index]._id);
  }
  user.cart = cart;
  await user.save();
}

//function for user sign in using google
async function googleUserSignIn(email) {
  return await User.findOne({
    email,
  });
}

// function for user sign in
async function userSignIn(info) {
  const user = await User.findOne({
    email: info.email,
  });
  if (!user) {
    throw new Error();
  }
  const validity = await bcrypt.compare(info.password, user.password);
  if (!validity) {
    throw new Error();
  }
  return user;
}

//function for creating a new user
async function newUser(user_) {
  user_.profilePic = "/img/profilepic" + Math.ceil(Math.random() * 20) + ".png"; // assigning a random img to user
  const user = new User(user_);
  await user.save();
  return user;
}

const userDB_ = {
  addToCart,
  addToWishlist,
  deleteFromCart,
  googleUserSignIn,
  userSignIn,
  newUser,
};

module.exports = userDB_;
