import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

export const signup = async (formData) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    const res = await axios.post(`/api/signup`, formData, config);
    setUser(res.data);
    return res;
  } catch (err) {
    if (err.response) {
      toast.error(err.response.data.msg);
    }
    return err;
  }
};

export const signin = async (formData) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = JSON.stringify(formData);
    const res = await axios.post(`/api/signin`, body, config);
    setUser(res.data);
    return res;
  } catch (err) {
    if (err.response) {
      toast.error(err.response.data.msg);
    }
    return err;
  }
};

export const setUser = (data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('jwt', JSON.stringify(data));
  }
};

export const isAuthenticated = () => {
  if (typeof window == 'undefined') {
    return false;
  }
  if (localStorage.getItem('jwt')) {
    return JSON.parse(localStorage.getItem('jwt'));
  } else {
    return false;
  }
};

export const signout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('jwt');
  }
};
