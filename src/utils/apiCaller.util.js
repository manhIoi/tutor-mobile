import axios from 'axios';
import {USER_TOKEN} from './auth.util';
import config from '../../config/config';

const CancelToken = axios.CancelToken;

export async function callApi(endpoint, method = 'get', body) {
  try {
    const params = {
      method: method,
      url: endpoint,
      data: body,
      headers: {
        // Authorization: `Bearer ${await USER_TOKEN.get()}`,
      },
      baseURL: config.API_BASE_URL,
    }
    console.info("LOGGER:: [req]", params);
    const res = await axios(params);
    console.info("LOGGER:: [res]", res);
    if (res && res.status === 200) {
      return res.data;
    }
    return Promise.reject(Error('Call api failed'));
  } catch (error) {
    console.info("LOGGER:: [call-api-error]", error);
    throw error;
  }
}

export async function callApiList(endpoint, method = 'get', body) {
  try {
    const res = await axios({
      method: method,
      url: endpoint,
      data: body,
      headers: {
        Authorization: `Bearer ${await USER_TOKEN.get()}`,
      },
      baseURL: config.API_BASE_URL,
    });
    if (res && res.status === 200) {
      return res.data;
    }
    return Promise.reject(Error('Call api failed'));
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function callApiClass(endpoint, method = 'get', body) {
  try {
    const res = await axios({
      method: method,
      url: endpoint,
      data: body,
      headers: {
        Authorization: `bearer ${await USER_TOKEN.get()}`,
      },
      baseURL: config.API_CLASS_URL,
    });
    if (res && res.data && res.data.success === true) {
      return res.data.payload;
    }
    return Promise.reject(Error('Call api failed'));
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function callApiClassList(endpoint, method = 'get', body) {
  try {
    const token = await USER_TOKEN.get();
    const res = await axios({
      method: method,
      url: endpoint,
      data: body,
      headers: {
        Authorization: `bearer ${await USER_TOKEN.get()}`,
      },
      baseURL: config.API_CLASS_URL,
    });
    if (res && res.data && res.data.success === true) {
      return res.data;
    }
    return Promise.reject(Error('Call api failed'));
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function callApiNotification(endpoint, method = 'get', body) {
  try {
    const res = await axios({
      method: method,
      url: endpoint,
      data: body,
      headers: {
        Authorization: `Bearer ${await USER_TOKEN.get()}`,
      },
      baseURL: config.NOTIFICATION_URL,
    });
    if (res && res.data && res.data.success === true) {
      return res.data.payload;
    }
    return Promise.reject(Error('Call api failed'));
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function callApiListNotification(endpoint, method = 'get', body) {
  try {
    const res = await axios({
      method: method,
      url: endpoint,
      data: body,
      headers: {
        Authorization: `Bearer ${await USER_TOKEN.get()}`,
      },
      baseURL: config.NOTIFICATION_URL,
    });
    if (res && res.data && res.data.success === true) {
      return res.data;
    }
    return Promise.reject(Error('Call api failed'));
  } catch (error) {
    console.log(error);
    throw error;
  }
}

/**
 * Upload file to server by axios
 * @param endpoint the full URL to get file
 * @param formData
 * @param config axios config
 * @param callback to set the cancel function
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function uploadFile(
  endpoint,
  formData,
  configure,
  callback = () => {},
) {
  console.info(`LOG_IT:: endpoint`, endpoint, formData, configure);
  // if (!(configure instanceof Object)) {
  //   configure = {};
  // }
  // // Ref: https://github.com/axios/axios#cancellation
  // configure.cancelToken = new CancelToken((cancelUploadFunction) => {
  //   // An executor function receives a cancel function as a parameter
  //   callback(cancelUploadFunction);
  // });
  //
  // if (!(configure.headers instanceof Object)) {
  //   configure.headers = {};
  // }
  //
  // configure.baseURL = config.UPLOAD_BASE_URL;
  //
  // configure.headers.Authorization = `bearer ${await USER_TOKEN.get()}`;
  // configure.headers['Content-Type'] = 'multipart/form-data';
  //
  // if (configure.method === 'put') {
  //   return await axios.put(endpoint, formData, configure);
  // }
  // return await axios.post(endpoint, formData, configure);
  return callApi(endpoint, 'post', { formData })
}

export async function callApiWithToken(
  endpoint,
  method = 'get',
  body,
  token = '',
) {
  try {
    const res = await axios({
      method: method,
      url: endpoint,
      data: body,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      baseURL: config.API_BASE_URL,
    });
    if (res && res.data && res.data.success === true) {
      return res.data.payload;
    }
    return Promise.reject(Error('Call api failed'));
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function callApiPayment(endpoint, method = 'get', body) {
  try {
    const res = await axios({
      method: method,
      url: endpoint,
      data: body,
      headers: {
        Authorization: `Bearer ${await USER_TOKEN.get()}`,
      },
      baseURL: config.API_PAYMENT_URL || 'https://tggs-payment.tesse.io/v1',
    });
    if (res && res.data && res.data.success === true) {
      return res.data.payload;
    }
    return Promise.reject(Error('Call api failed'));
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function callApiPaymentList(endpoint, method = 'get', body) {
  try {
    const res = await axios({
      method: method,
      url: endpoint,
      data: body,
      headers: {
        Authorization: `Bearer ${await USER_TOKEN.get()}`,
      },
      baseURL: config.API_PAYMENT_URL || 'https://tggs-payment.tesse.io/v1',
    });
    if (res && res.data && res.data.success === true) {
      return res.data;
    }
    return Promise.reject(Error('Call api failed'));
  } catch (error) {
    console.log(error);
    throw error;
  }
}
