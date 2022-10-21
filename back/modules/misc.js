const serviceResToRoutingAction = (serviceRes, req, res, next) => {
// note: Express-dependent implementation
if (!serviceRes) {
    throw new Error("The service returned no response");
  }

  const {error, status} = serviceRes;
  if (error) {
    return next(error);
  }

  if (status == 301) {
    return res.redirect(serviceRes.url);
  }

  if (status) {
    res.status(status);
    const {status: _, ...remaining} = serviceRes;
    if (!Object.keys(remaining).length) {
      res.end();
      return;
    }
  }

  if (typeof serviceRes == "string") {
    return res.send;
  }

  res.json(serviceRes);
}

const routingParamsToServiceArgs = (req, res, next) => {
// note: Express-dependent implementation
  return {
    user: req.user,
    params: req.params,
    body: req.body,
    query: req.query,
  };
}

export const serviceRouteWrap = (service) => async (...args) => {
  const routingArgs = routingParamsToServiceArgs(...args);
  let response = null;

  try {
    response = await service(routingArgs);
  } catch (error) {
    response = {
      error,
      throwed: true,
    };
  }

  serviceResToRoutingAction(response, ...args);
}
  