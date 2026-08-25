import axios from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";


// =====================================================
// API CONFIGURATION
// =====================================================

const api = axios.create({

    baseURL: "http://192.168.0.160:5000/api",

    headers: {

        "Content-Type": "application/json",

    },

});


// =====================================================
// ATTACH AUTH TOKEN
// =====================================================

api.interceptors.request.use(

    async (config) => {

        try {

            // -------------------------------------------------
            // Get saved authentication token
            // -------------------------------------------------

            let token =
                await AsyncStorage.getItem("token");


            // -------------------------------------------------
            // Fallback keys
            // -------------------------------------------------

            if (!token) {

                token =
                    await AsyncStorage.getItem(
                        "authToken"
                    );

            }


            if (!token) {

                token =
                    await AsyncStorage.getItem(
                        "accessToken"
                    );

            }


            // -------------------------------------------------
            // Attach token to request
            // -------------------------------------------------

            if (token) {

                config.headers =
                    config.headers || {};

                config.headers.Authorization =
                    `Bearer ${token}`;


                console.log(
                    "API AUTH TOKEN FOUND"
                );

            } else {

                console.log(
                    "API AUTH TOKEN NOT FOUND"
                );

            }


            return config;

        }

        catch (error) {

            console.log(
                "API TOKEN ERROR:",
                error.message
            );

            return Promise.reject(error);

        }

    },

    (error) => {

        return Promise.reject(error);

    }

);


export default api;