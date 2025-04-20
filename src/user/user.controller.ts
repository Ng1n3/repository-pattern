import { Request, Response } from 'express';
import { CreateUserDto, UpdateUserDto } from '../entity/User';
import { UserService } from './user.service';

export class UserController {
  
  constructor(private userService: UserService) {
    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findById = this.findById.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }


  async create(req: Request, res: Response) {
    try {
      const user = await this.userService.create(req.body as CreateUserDto);
      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const users = await this.userService.findAll();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const user = await this.userService.findById(req.params.id);
      res.json(user);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const user = await this.userService.update(
        req.params.id,
        req.body as UpdateUserDto
      );
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await this.userService.delete(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
