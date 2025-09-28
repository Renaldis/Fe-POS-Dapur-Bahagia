const AuthApi = {
  Register: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/register`,
  Login: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/login`,
  GetMe: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/me`,
};
const OrderApi = {
  Register: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders`,
};

export { AuthApi, OrderApi };
