/*
user route file
all data will be sent in url params
*/

const express = require("express");
const path = require("path");

const auth = require("../middleware/auth");
const userDB = require("../lib/user");

const router = express.Router();
const public = path.join(__dirname, "../../public");

router.get("/user", auth, (req, res) => {
  res.status(200).send(req.user);
});

// route to check if token is valid
router.post("/user", auth, (req, res) => {
  res.status(200).send({
    firstName: req.user.firstName,
    profilePic: req.user.profilePic,
    cart: req.user.cart,
    wishlist: req.user.wishlist,
  });
});

// for new user
router.post("/user/:email/:firstName/:lastName/:password", async (req, res) => {
  try {
    const { user, token } = await userDB.newUser(req.params);
    res
      .cookie("token", token, {
        path: "/",
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: "strict",
      })
      .status(201)
      .send();
  } catch {
    res.status(400).send();
  }
});

// route for signing in or creating a new account with google
router.post("/user/:token/google", async (req, res) => {
  try {
    const token = await userDB.googleUserSignIn(req.params.token);
    res
      .cookie("token", token, {
        path: "/",
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: "strict",
      })
      .status(200)
      .send();
  } catch {
    res.status(400).send();
  }
});

// for signing in
router.post("/user/:email/:password", async (req, res) => {
  try {
    const token = await userDB.userSignIn({
      email: req.params.email,
      password: req.params.password,
    });
    res
      .cookie("token", token, {
        path: "/",
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: "strict",
      })
      .status(200)
      .send();
  } catch {
    res.status(401).send();
  }
});

// for signing out
router.post("/user/out", auth, async (req, res) => {
  try {
    await userDB.userSignOut(req.user, req.token);
    res
      .clearCookie("token", {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
      })
      .status(200)
      .send();
  } catch {
    res.status(400).send();
  }
});

// for signing out all
router.post("/user/all", auth, async (req, res) => {
  try {
    await userDB.userSignOutAll(req.user);
    res
      .clearCookie("token", {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
      })
      .status(200)
      .send();
  } catch {
    res.status(400).send();
  }
});

// for updating user
router.patch("/user/:email/:firstName/:lastName", auth, async (req, res) => {
  try {
    await userDB.userUpdate(req.user, req.params);
    res.status(201).send();
  } catch {
    res.status(400).send();
  }
});

// for updating user password
router.patch("/user/:password/ps", auth, async (req, res) => {
  try {
    await userDB.userUpdatePassword(req.user, req.params);
    res.status(201).send();
  } catch {
    res.status(400).send();
  }
});

// for adding to wishlist
router.patch("/user/:productId", auth, async (req, res) => {
  try {
    await userDB.addToWishlist(req.user, req.params.productId);
    res.status(201).send();
  } catch {
    res.status(400).send();
  }
});

// for adding an address
router.patch(
  "/user/:line1/:line2/:landmark/:pincode/:state/address",
  auth,
  async (req, res) => {
    try {
      await userDB.addNewAddress(req.user, req.params);
      res.status(201).send();
    } catch {
      res.status(400).send();
    }
  }
);

// for deleting from wishlist
router.delete("/user/:productId", auth, async (req, res) => {
  try {
    await userDB.deleteFromWishlist(req.user, req.params.productId);
    res.status(201).send();
  } catch {
    res.status(400).send();
  }
});

// for deleting an address
router.delete("/user/:addressId/address", auth, async (req, res) => {
  try {
    await userDB.deleteAddress(req.user, req.params.addressId);
    res.status(201).send();
  } catch {
    res.status(400).send();
  }
});

router.get("/*", (req, res) => {
  res.sendFile("index.html", { root: public });
});

module.exports = router;
