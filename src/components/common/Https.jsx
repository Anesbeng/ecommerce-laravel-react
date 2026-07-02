export const ApiUrl = "http://localhost/ecommerce/backend/public/api";

export const AdminToken = () => {
  const data = JSON.parse(localStorage.getItem("admininfo"));
  return data?.token;
};
export const UserToken = () => {
  const data = JSON.parse(localStorage.getItem("userinfo"));
  return data?.token;
};
