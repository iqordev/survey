import axios from "axios";

// https://iqorfuncmobchat001.azurewebsites.net
const API_URL = "https://iqorfncmobchat.azurewebsites.net";
const instance = axios.create({
  baseURL: `${API_URL}/api`,
});

export const submitResults = async (data, token) => {
  try {
    console.log(data);
    await instance.post("surveys", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    throw error;
  }
};
