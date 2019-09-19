export const request = async (method, endpoint, json = {}) => {
  const res = await fetch(endpoint, {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(json)
  });

  // Redirect us if the request wants us to be redirected
  if (res.redirected) {
    window.location.href = res.url;
  }

  if (!res.ok) {
    console.error(res);
  }

  return res;
};

export const post = request.bind(null, "POST");

export const get = request.bind(null, "GET");

export const checkAuthenticated = async () => {
  const res = await fetch("/api/v1/active-user");
  const data = await res.json();
  console.log(data);
  return data;
};

/**
 * These options determine how we render our date objects, e.g. Monday,
 * September 9, 2019, 12:15 AM.
 */
const DATE_OPTIONS = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric"
};

/**
 * Renders the specified date object to a string.
 * @param date the specified date object
 */
export const renderDate = date =>
  new Date(date).toLocaleDateString("en-US", DATE_OPTIONS);
