import axios from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";


const api = axios.create({

    baseURL: "http://192.168.0.160:5000/api",

    headers: {

        "Content-Type": "application/json",

    },

});


api.interceptors.request.use(

    async (config) => {

        try {

            const token =
                await AsyncStorage.getItem("token");


            if (token) {

                config.headers =
                    config.headers || {};

                config.headers.Authorization =
                    `Bearer ${token}`;

            }


            return config;

        }

        catch (error) {

            return Promise.reject(error);

        }

    },

    (error) => {

        return Promise.reject(error);

    }

);


export default api;