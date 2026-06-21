import {v2 as cloudinary} from "cloudinary"
import {envConfig} from "./envConfig.js"



cloudinary.config({
    cloud_name:envConfig.cloudName as string,
    api_key:envConfig.cloudApi as string,
    api_secret:envConfig.cloudSecret as string
})

export default cloudinary