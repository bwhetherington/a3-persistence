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
  const { username, name, postIDs, joinTime } = user;
  return { username, name, postIDs, joinTime };
};

/**
 * Produces a view of the specified post that determines whether ot not the
 * requesting user is the author of the post.
 * @param user The requesting user
 * @param post The post to view
 */
const getPostView = (user, post) => {
  if (user) {
    const { username } = user;
    const { author } = post;
    const isOwnPost = username === author;
    return { isOwnPost, ...post };
  } else {
    return { isOwnPost: false, ...post };
  }
};

const api = db => {
  const router = express.Router();

  /**
   * Returns the currently active user to the specified client if the client is
   * logged in to the server.
   */
  router.get("/active-user", (req, res) => {
    if (req.isAuthenticated()) {
      const { user } = req;
      res.json({ isAuthenticated: true, user });
    } else {
      res.json({ isAuthenticated: false, user: null });
    }
  });

  const BANNED_USERNAMES = ["admin", "list"];

  /**
   * POST /users/new
   *
   * Creates a new user with the specified fields.
   *
   * Body:
   *   username = The username of the new user
   *   name = The name of the new user
   *   password = The password of the new user
   */
  router.post(
    "/users/new",
    async (req, res, next) => {
      const { username, name, password } = req.body;

      if (BANNED_USERNAMES.indexOf(username) > 0) {
        res.status(500).json({ message: "That username is not available." });
      }

      const joinTime = Date.now();

      // Check if we already have this user
      const existing = await db
        .get("users")
        .find(user => user.username === username)
        .value();

      if (existing) {
        res.status(500).json({ message: "That username is not available." });
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

  /**
   * GET /users/list
   *
   * Returns a list of all users to the
   */
  router.get("/users/list", async (_, res) => {
    const users = await db
      .get("users")
      .map(getSafeView)
      .value();
    res.send(users);
  });

  /**
   * GET /users/:username
   *
   * Returns a safe view of the user with the specified username to the
   * response.
   */
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

  /**
   * GET /users/:username/posts
   *
   * Returns all posts made by the author with the specified username to the
   * response.
   */
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

  /**
   * GET /posts/list
   *
   * Returns the list of all posts to the response.
   */
  router.get("/posts/list", async (req, res) => {
    const { user } = req;
    const posts = await db
      .get("posts")
      .filter(_ => true)
      .map(post => getPostView(user, post))
      .value();
    res.json(posts);
  });

  /**
   * GET /posts/:id
   *
   * Returns the post with the specified ID to the response.
   */
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

  /**
   * Checks whether or not the user is authenticated. If they are not
   * authenticated, they receive a 401 error.
   */
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

  /**
   * POST /posts/delete
   *
   * Deletes the post with the specified ID and returns the user to the list of
   * other posts.
   *
   * Body:
   *   id = The ID of the post to delete
   */
  router.post("/posts/delete", ensureOwnPost, async (req, res) => {
    const { id } = req.body;
    await db
      .get("posts")
      .unset(id)
      .write();
    res.redirect("/");
  });

  /**
   * POST /posts/edit
   *
   * Edits a specified post.
   *
   * Body:
   *   id = The post id
   *   content = The new content of the post
   */
  router.post("/posts/edit", ensureOwnPost, async (req, res) => {
    const { id, content } = req.body;
    await db
      .get("posts")
      .get(id)
      .assign({ content })
      .write();
    res.redirect("/");
  });

  /**
   * POST /posts/new
   *
   * Publishes the specified post.
   *
   * Body:
   *   title = The title of the post
   *   content = The content of the post
   */
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

    res.redirect("/");
  });

  return router;
};

export default api;
