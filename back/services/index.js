import services from "./services.js";

const wrappedServices = (model) => {
  Object.values(services).reduce((services, [name, service]) => {
    services[name] = service(model);
  });
};

export default wrappedServices;
