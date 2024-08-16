import { Router } from "express";
const userRoutes = Router();
import userController from './users.controller.js';


userRoutes.get('/users/login',userController.logIn);

userRoutes.get('/users',userController.getUsers)

userRoutes.get('/usersQ',userController.searchUserName)

userRoutes.get('/users/age/:age',userController.getUsersHasAge)

userRoutes.post('/users',userController.signUp)
userRoutes.get('/users/confirm/:id',userController.confirmUser)


userRoutes.delete('/users/:id',userController.deleteUser)

userRoutes.put('/users/:id',userController.updateUser)

userRoutes.get('/users/:id',userController.getUserByPost)
userRoutes.get('/users/post/:postID',userController.getUserByPost)


export default userRoutes;








