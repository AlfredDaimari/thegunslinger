// functions specific to user operations
const { OAuth2Client } = require("google-auth-library");

const userDB_ = require("../db/userReadWrite");
const productDB_ = require("../db/productReadWrite");

const client = new OAuth2Client("--- add google auth client here ---");

async function addNewAddress(user, address) {
  user.address.push(address);
  await user.save();
}

// check for redundancy at the front
async function addToWishlist(user, productId) {
  await userDB_.addToWishlist(user, productId);
  await user.save();
  await productDB_.increaseWishlistCounter(productId);
}

async function deleteAddress(user, addressId) {
  user.address.pull(addressId);
  await user.save();
}

// delete an item from user wishlist
async function deleteFromWishlist(user, productId) {
  user.wishlist.pull(productId);
  await user.save();
  await productDB_.decreaseWishlistCounter(productId);
}

function getCartInfo(user) {
  return user.cart;
}

async function newUser(userDetails) {
  // add code for selecting a random profile pic
  const user = await userDB_.newUser(userDetails);
  const token = await user.generateToken();
  return {
    user,
    token,
  };
}

async function googleUserSignIn(token_) {
  const ticket = await client.verifyIdToken({
    idToken: token_,
    audience: "--- add google auth client here ---",
  });
  const payload = ticket.getPayload();
  const email = payload["email"];
  let user = await userDB_.googleUserSignIn(email);

  // if the user doesn't exist create a new account using the google details
  if (!user) {
    user = await userDB_.newUser({
      email,
      firstName: payload["given_name"],
      lastName: payload["family_name"],
      password: String(Date.now()) + payload["name"],
    });
  }
  const token = await user.generateToken();
  return token;
}

async function userSignIn(info) {
  let user = await userDB_.userSignIn(info);
  const token = await user.generateToken();
  return token;
}

async function userSignOut(user, token_) {
  user.tokens = user.tokens.filter((token) => token.token != token_);
  await user.save();
}

async function userSignOutAll(user) {
  user.tokens = [];
  await user.save();
}

async function userUpdate(user, updates) {
  for (i in updates) {
    user[i] = updates[i];
  }
  await user.save();
}

async function userUpdatePassword(user, updates) {
  user.password = updates.password;
  await user.save();
}

const userDB = {
  addNewAddress,
  addToCart: userDB_.addToCart,
  addToWishlist,
  deleteAddress,
  deleteFromWishlist,
  deleteFromCart: userDB_.deleteFromCart,
  googleUserSignIn,
  userSignIn,
  userSignOut,
  userSignOutAll,
  userUpdate,
  userUpdatePassword,
  getCartInfo,
  newUser,
};

module.exports = userDB;
