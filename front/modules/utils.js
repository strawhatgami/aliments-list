export const customFetch = async ({ method = "GET", uri, content = null}) => {
  const contentHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  let customHeaders = {};

  if (method && method.toUpperCase() != "GET" && content) customHeaders = contentHeaders;

  const body = content !== null ? JSON.stringify(content) : null;

  const response = await fetch(uri, {
    method: method || "GET",
    headers: customHeaders,
    credentials: 'include',
    body,
  });

  if (!response.ok) {
    const { url, status, statusText } = response;
    const err = new Error(statusText || "Unknown error");
    Object.assign(err, {url, status});
    throw err;
  }

  const contentType = response.headers.get("content-type");

  let response_content = null;
  if (contentType?.includes("application/json")) {
    response_content = await response.json();
  } else {
    response_content = await response.text();
  }

  return response_content;
}
