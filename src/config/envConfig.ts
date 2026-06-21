import {config} from "dotenv";


config()

export const envConfig={
    port:process.env.PORT,
    databaseUrl:process.env.DATABASE_URL,
    secret_token:process.env.SECRET_TOKEN,
    email:process.env.EMAIL,
    password:process.env.EMAIL_PASSWORD,
    cloudName:process.env.CLOUD_NAME,
    cloudApi:process.env.CLOUD_API,
    cloudSecret:process.env.CLOUD_SECRET_KEY,
    admin_email:process.env.ADMIN_EMAIL,
    admin_password:process.env.ADMIN_PASSWORD,
    admin_user:process.env.ADMIN_USER
}