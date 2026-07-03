export const ApiUrl = "http://192.168.1.4/ecommerce/backend/public/api";

export const AdminToken = () => {
  const data = JSON.parse(localStorage.getItem("admininfo"));
  return data?.token;
};
export const UserToken = () => {
  const data = JSON.parse(localStorage.getItem("userinfo"));
  return data?.token;
};
