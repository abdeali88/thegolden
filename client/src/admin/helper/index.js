import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

export const getUnverifiedUsers = async (user, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.get(
      `/api/admin/unverified-users/${user._id}`,
      config
    );
    return res;
  } catch (err) {
    if (err.response) {
      toast.error(err.response.data.msg);
    }
    return err;
  }
};

export const verifyUser = async (user, token, id) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.put(
      `/api/admin/verify-user/${user._id}/${id}`,
      null,
      config
    );
    return res;
  } catch (err) {
    if (err.response) {
      toast.error(err.response.data.msg);
    }
    return err;
  }
};
