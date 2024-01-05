import userApi from "./user-refreshTokenApi";

const getPublicContent = () => {
  return userApi.get( "/test/all");
};

const getClientContent = () => {
  return userApi.get( "/test/client");
};

const getDeliveryContent = () => {
  return userApi.get( "/test/delivery");
};

const getAdminContent = () => {
  return userApi.get( "/test/admin");
};

const getUserInfo = (id) => {
  return userApi.get( `/findone/${id}`);
};

const updateProfile = (id, data) => {
  return userApi.put(`/updateone/${id}`, data);
};
const create = (data) => {
  return userApi.post('/create', data)
}

const UserService ={
  getPublicContent,
  getClientContent,
  getDeliveryContent,
  getAdminContent,
  getUserInfo,
  updateProfile,
  create,
};

export default UserService ;
