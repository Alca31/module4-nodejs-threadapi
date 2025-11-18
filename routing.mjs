export function Routes(controller) {
  return (app, base) => {
    app.get(base, controller.getAll);
    app.get(`${base}/:id`, controller.getOne);
    app.post(base, controller.create);
    app.put(`${base}/:id`, controller.update);
    app.delete(`${base}/:id`, controller.remove);
  };
}
