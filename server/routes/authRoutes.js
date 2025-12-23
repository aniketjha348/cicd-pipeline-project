import express from 'express'
import { Auth } from '../controllers/Auth.js';
const authRoute=express.Router();
import {verifyUserToken} from '../middlewares/auth.js'
authRoute.post('/login',Auth.login);
authRoute.post('/register', Auth.registerUser);
authRoute.post('/admin/register', verifyUserToken, Auth.registerUser);
// Admin can register any role (faculty, student)


authRoute.get("/verify-user",verifyUserToken,Auth.verifyUser);
authRoute.get("/logout",Auth.logoutUser);



export default authRoute