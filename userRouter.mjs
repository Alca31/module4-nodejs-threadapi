import { auth } from "./auth.mjs";
import express from "express";

export function userRoute(controller) 
{
  const router = express.Router();
  router.post("/login", controller.userLogin.bind(controller));
  router.get("/logout", controller.logout.bind(controller));
  router.put("/:id", auth,controller.update.bind(controller));
  router.get("/all", auth, controller.getAll.bind(controller));
  router.post("/specific", auth, controller.getUserbyNameorMail.bind(controller));
  router.post("/register", controller.create.bind(controller));
  router.delete("/:id", auth,controller.remove.bind(controller));
  router.get("/:id", auth, controller.getOne.bind(controller));
  return router;
}

