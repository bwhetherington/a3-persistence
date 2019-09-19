import path from "path";
import express from "express";
import session from "express-session";
import passport from "passport";
import bodyParser from "body-parser";
import { initDB } from "./db";
import { Strategy as LocalStrategy } from "passport-local";
import api from "./api";
import { ensureLoggedIn, comparePassword } from "./util";
import morgan from "morgan";
import helmet from "helmet";

const AUTH_ERROR_MESSAGE = "Username or password was incorrect.";

const main = async () => {
  const app = express();
  const db = await initDB();

  const strategy = new LocalStrategy(async (username, password, done) => {
    const user = await db
      .get("users")
      .find(user => user.username === username)
      .value();
    if (user && (await comparePassword(password, user.passwordHash))) {
      done(null, user);
    } else {
      done(null, null, { message: AUTH_ERROR_MESSAGE });
    }
  });

  passport.use("local", strategy);
  passport.serializeUser(async (user, done) => {
    done(null, user.username);
  });
  passport.deserializeUser(async (username, done) => {
    const user = await db
      .get("users")
      .find(user => user.username === username)
      .value();
    if (user) {
      done(null, user);
    } else {
      done(null, null, { message: "User not found." });
    }
  });

  app.use(morgan("tiny"));
  app.use(helmet());
  app.use(express.static("dist"));
  app.use(bodyParser.json());
  app.use(
    session({ secret: "Secret", resave: false, saveUninitialized: false })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  app.post(
    "/auth",
    passport.authenticate("local", {
      session: true,
      failureRedirect: "/login",
      successRedirect: "/"
    })
  );

  app.post("/logout", (req, res) => {
    const { session } = req;
    if (session) {
      session.destroy();
    }
    res.redirect("/");
  });

  app.get("/authenticated", (req, res) => {
    res.send(req.isAuthenticated());
  });

  app.get("/authenticated/user", ensureLoggedIn, (req, res) => {
    res.send(req.user);
  });

  app.get("/to-home", (req, res) => {
    res.redirect("/");
  });

  app.use("/api/v1", api(db));

  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
  });

  app.listen(process.env.PORT || 3000);
};

main().catch(console.log);
