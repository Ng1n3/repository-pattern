import express from 'express';
import { UserRepository } from '../repos/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

const userRouter = express.Router();
const userRepository = new UserRepository();
const userService = new UserService(userRepository)
const userController = new UserController(userService);

userRouter.post('/', userController.create);
userRouter.get('/', userController.findAll);
userRouter.get('/:id', userController.findById);
userRouter.put('/:id', userController.update);
userRouter.delete('/:id', userController.delete);

export default userRouter;
