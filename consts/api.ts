const RouteApi = {
  Register: `${process.env.PUBLIC_API}/api/v1/users/register`,
  Login: `${process.env.PUBLIC_API}/api/v1/users/login`,
  GetMe: `${process.env.PUBLIC_API}/api/v1/users/me`,
};

export { RouteApi };
