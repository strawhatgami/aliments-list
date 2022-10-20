import services from "./services.js";
import {models} from "../model/index.js";
 
const wrappedServices = Object.entries(services)
  .reduce((wrapped, [name, service]) => {
    wrapped[name] = service(models);
    return wrapped;
  }, {});

export default wrappedServices;
