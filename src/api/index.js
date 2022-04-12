import axios from 'axios';
import apiConfig from '../config/apiConfig.json';

const { connection = {}, datasources = {} } = apiConfig;
const { scheme = 'http', hostname = 'localhost:5000', defaultHeaders = {} } = connection;

const api = axios.create({
  baseURL: `${scheme}://${hostname}/api`,
  headers: defaultHeaders,
});

async function axiosTransformer(datasource, body = null, routeParams = '') {
  const { method, uri, headers } = datasource;
  switch (method) {
    case 'GET':
      return await api.get(uri + routeParams, { ...defaultHeaders, headers });
    case 'POST':
      return await api.post(uri + routeParams, body, { ...defaultHeaders, headers });
    case 'DELETE':
      return await api.delete(uri + routeParams, { ...defaultHeaders, headers });
    default:
      console.error(`Invalid method type ${method}`);
  }
}

const getAllUsers = () => axiosTransformer(datasources?.getAllUsers);
const getUser = (id) => axiosTransformer(datasources?.getUser, null, `/${id}`);
const createUser = (body) => axiosTransformer(datasources?.createUser, body);
const getFriends = (userId) => axiosTransformer(datasources?.getFriends, null, `/${userId}`);
const getRecommendations = (userId) =>
  axiosTransformer(datasources?.getRecommendations, null, `/${userId}`);
const getAsset = (id) => axiosTransformer(datasources?.getAsset, null, `/${id}`);

// GET /users/{id}
// return {
//         id
//         name
//         email
//         profile_pic: asset_id
//
//        }

// GET /users
// return [{
//         id
//         name
//         email
//         profile_pic: asset_id
//        },
//        {
//         id
//         name
//         email
//         profile_pic: asset_id
//        },
//        ...]

// GET /asset
// return {
//         id
//         url
//         metadata {
//             width
//             height
//         }
//        }

// GET /friends/{userId}
// return [{
//         id
//         name
//         email
//         profile_pic: asset_id
//         weight
//        },
//        {
//         id
//         name
//         email
//         profile_pic: asset_id
//         weight
//        },
//        ...]

// GET /recommendations/{userId}
// return [{
//         id
//         name
//         email
//         profile_pic: asset_id
//         weight
//        },
//        {
//         id
//         name
//         email
//         profile_pic: asset_id
//         weight
//        },
//        ...]

const apis = {
  getAllUsers,
  getUser,
  createUser,
  getFriends,
  getRecommendations,
  getAsset,
};

export default apis;
