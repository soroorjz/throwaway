import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api", 
  headers: {
    "RAYAN-USERNAME": "S.JAMEIE",
    "RAYAN-PASSWORD": "1156789",
    "RAYAN-DEBUG": "TRUE",
    "RAYAN-TOKEN": "", 
  },
});

export default apiClient;