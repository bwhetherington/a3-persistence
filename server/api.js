import express from "express";
import { ensureLoggedIn, hashPassword } from "./util";
import passport from "passport";
import uuidv1 from "uuid/v1";

/**
 * Produces a safe view of the specified user profile. It contains all fields
 * of the original user profile, but does not contain the hashed password.
 * @param user The user to view
 */
const getSafeView = user => {
  const { username, name, postIDs } = user;
  return { username, name, postIDs };
};

const getPostView = (user, post) => {
  if (user) {
    const { username } = user;
    const { author } = post;
    console.log("username", username);
    console.log("author", author);
    const isOwnPost = username === author;
    console.log(isOwnPost);
    return { isOwnPost, ...post };
  } else {
    return { isOwnPost: false, ...post };
  }
};

const api = db => {
  const router = express.Router();

  router.get("/active-user", (req, res) => {
    if (req.isAuthenticated()) {
      const { user } = req;
      res.json({ isAuthenticated: true, user });
    } else {
      res.json({ isAuthenticated: false, user: null });
    }
  });

  router.post(
    "/users/new",
    async (req, res, next) => {
      const { username, name, password } = req.body;

      const joinTime = Date.now();

      // Check if we already have this user
      const existing = await db
        .get("users")
        .find(user => user.username === username)
        .value();

      if (existing) {
        res.status(500).json({ message: "That username is already in use." });
      } else {
        // Encrypt password
        const passwordHash = await hashPassword(password);
        const newUser = {
          username,
          passwordHash,
          name,
          postIDs: [],
          joinTime
        };
        await db
          .get("users")
          .push(newUser)
          .write();
        // Log the user in?
        next();
      }
    },
    passport.authenticate("local", {
      session: true,
      successRedirect: "/",
      failureRedirect: "/login"
    })
  );

  router.get("/users/:username", async (req, res) => {
    const findName = req.params.username;
    const user = await db
      .get("users")
      .find(user => user.username === findName)
      .value();
    if (user) {
      res.json(getSafeView(user));
    } else {
      res.status(404);
      res.json({ message: "User not found." });
    }
  });

  router.get("/users/:username/posts", async (req, res) => {
    const { user, params } = req;
    const { username } = params;
    const posts = await db
      .get("posts")
      .filter(post => post.author === username)
      .map(post => getPostView(user, post))
      .value();
    res.json(posts);
  });

  router.get("/posts/list", async (req, res) => {
    const { user } = req;
    const posts = await db
      .get("posts")
      .filter(_ => true)
      .map(post => getPostView(user, post))
      .value();
    res.json(posts);
  });

  router.get("/posts/", async (req, res) => {
    const { user } = req.body;
    if (user) {
      const posts = await db
        .get("posts")
        .filter(post => post.author === user)
        .map(post => getPostView(user, post))
        .value();
      res.json(posts);
    } else {
      res.status(404);
      res.json({ message: "No user specified." });
    }
  });

  router.get("/posts/:id", async (req, res) => {
    const { user, params } = req;
    const { id } = params;
    const post = await db
      .get("posts")
      .get(id)
      .value();
    if (post) {
      res.json(getPostView(user, post));
    } else {
      res.status(404);
      res.json({ message: "Post not found." });
    }
  });

  const ensureOwnPost = async (req, res, next) => {
    console.log(req.body);

    if (!req.isAuthenticated()) {
      res.status(401);
      res.json({ message: "User must be logged in to modify posts." });
    }

    const { id } = req.body;

    // Look up the post
    const post = await db
      .get("posts")
      .get(id)
      .value();

    if (post) {
      // Check if the request is from the author of the post
      if (post.author === req.user.username) {
        // We can continue
        next();
      } else {
        // Otherwise, user is not authorized
        res.status(401);
        res.json({
          message: "You are not authorized to modify others' posts."
        });
      }
    } else {
      console.log(req.body);
      res.status(404);
      res.json({ message: "Post not found." });
    }
  };

  router.post("/posts/delete", ensureOwnPost, async (req, res) => {
    const { id } = req.body;
    await db
      .get("posts")
      .unset(id)
      .write();
    res.redirect("/list");
  });

  router.post("/posts/edit", ensureOwnPost, async (req, res) => {
    const { id, content } = req.body;
    await db
      .get("posts")
      .get(id)
      .assign({ content })
      .write();
    res.redirect("/list");
  });

  router.post("/posts/new", ensureLoggedIn("/login"), async (req, res) => {
    const { user } = req;
    const { title, content } = req.body;
    const postID = uuidv1();
    const time = Date.now();

    // Construct post
    const post = {
      author: user.username,
      title,
      content,
      id: postID,
      time
    };

    // Add to the set of posts
    await db
      .get("posts")
      .assign({ [postID]: post })
      .write();

    // Add to the user's list of posts
    await db
      .get("users")
      .find(found => found.username === user.username)
      .get("postIDs")
      .push(postID)
      .write();

    res.redirect("/list");
  });

  router.get("/users", ensureLoggedIn("/unauthorized"), async (req, res) => {
    const users = await db.get("users").value();
    res.send(users);
  });

  return router;
};

export default api;
