//对 axios 进行二次封装：使用请求拦截器、响应拦截器
import axios from "axios";

//step 1：利用axios的create方法创建一个axios实例 （其他配置：基础路径、超时时间）
const request = axios.create({
  //基础路径
  baseURL: '/api',//基础路径会携带/api
  timeout: 5000 // 超时时间的设置
});

//step 2:给axios实例添加请求与响应拦截器
request.interceptors.request.use((config) => {
  //返回配置对象
  return config
});

//step 3:响应拦截器
request.interceptors.response.use((response) => {
  //成功回调

  //简化数据
  return response.data
}, (error) => {
  //失败回调:处理http网络错误

  //定义一个变量：存储网络错误信息
  let message = '';

  //http状态码
  const status = error.response.status;

  switch (status) {
    case 400:
      message = 'Request Param Wrong'; break;
    case 401:
      message = 'Token Expired'; break;
    case 403:
      message = 'Permission Denied'; break;
    case 404:
      message = 'RequestUrl Error'; break;
    case 500:
      message = 'Server Error'; break;
    default:
      message = 'NetWork Error'; break;
  }

  console.log(message);

  return Promise.reject(error)
});


// console.log(import.meta.env.VITE_APP_API_URL);
//对外暴露
export default request
