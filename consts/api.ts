const AuthApi = {
  Register: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/register`,
  Login: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/login`,
  GetMe: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/me`,
};
const MenuApi = {
  GetAll: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/menus`,
  Update: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/menus`,
  GetById: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/menus`,
};

export { AuthApi, MenuApi };
