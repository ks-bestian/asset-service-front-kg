import axios from 'axios';
import router from '@/router';
import VueCookies from 'vue-cookies';
import { useStore } from "@/store";


const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

// Request interceptor setting

instance.interceptors.request.use(
  function (config) {
    // if (config.method === 'get') {
      config.params = config.params || {};
      config.params['lang'] = localStorage.getItem("languageType");
    // }
    
    // const token =VueCookies.get('jwtToken'); 

    const store = useStore();
    const token = store.jwtToken;
    if (token && !config.url.includes('/api/save-route')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      const store = useStore();

      //Error Guide (toast)

      const errMsg = error.response?.data?.message || error.message;
      store.toast.add({ severity: 'error', summary: 'Error', detail: errMsg, life: 60000 });

      if (error.response && error.response.status === 401) {
        // 401 Redirection with a login page when an error occurs
        // Vuecookies.remove ('jwttoken');

        
        // Store.logino = null;

        store.reset();
        // store.dispatch('updateUser', { userId: null, token: null, loginInfo: null });

        router.push('/'); // Login page

      }

      return Promise.reject(error);
    }
  );


export default instance;