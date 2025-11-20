import { auth } from "./auth.mjs";
import express from "express";

export function userRouter(controller) 
{
  const router = express.Router();
  router.get("/all", auth, controller.getAll.bind(controller));
  router.get("/:id", auth, controller.getOne.bind(controller));
  router.post("/register", controller.create.bind(controller));
  router.post("/login", controller.userLogin.bind(controller));
  router.post("/specific", auth, controller.userLogin.bind(controller));
  router.put("/:id", controller.update.bind(controller));
  router.delete("/:id", controller.remove.bind(controller));
  return router;
}

