import { registerAs } from "@nestjs/config";

export default registerAs('db', ()=> ({
    dbhost : process.env.DATABASE_HOST,
    dbport: process.env.DATABASE_PORT,
    dbuser : process.env.DATABASE_USER,
    dbpassword : process.env.DATABASE_PASSWORD,
    dbname : process.env.DATABASE_NAME

}))