import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

export const getUser = async (user, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.get(`/api/user/${user._id}`, config);
    return res;
  } catch (err) {
    console.log(err);
    return err;
  }
};
