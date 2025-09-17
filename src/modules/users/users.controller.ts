import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { User } from '../../interfaces/user.interface';

@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Endpoint pentru toți utilizatorii (doar admin)
  @Get('list')
  @Roles('admin')
  getAllUsers() {
    return {
      success: true,
      message: 'Lista utilizatorilor',
      data: this.usersService.getAllUsers(),
    };
  }

  // Endpoint pentru profilul utilizatorului
  @Get('profile')
  @Roles('user', 'admin')
  getUserProfile() {
    return {
      success: true,
      message: 'Profil utilizator',
      data: 'Accesibil pentru user și admin',
    };
  }

  @Post()
  @Roles('admin')
  createUser(@Body() userData: Omit<User, 'id' | 'createdAt'>) {
    const newUser = this.usersService.createUser(userData);
    return {
      success: true,
      message: 'Utilizator creat cu succes',
      data: newUser,
    };
  }

  @Put(':id')
  @Roles('admin')
  updateUser(@Param('id') id: string, @Body() updates: Partial<User>) {
    const userId = parseInt(id);
    if (isNaN(userId)) throw new NotFoundException('ID invalid');

    const updatedUser = this.usersService.updateUser(userId, updates);
    if (!updatedUser) throw new NotFoundException('Utilizator nu a fost găsit');

    return {
      success: true,
      message: 'Utilizator actualizat cu succes',
      data: updatedUser,
    };
  }

  @Delete(':id')
  @Roles('admin')
  deleteUser(@Param('id') id: string) {
    const userId = parseInt(id);
    if (isNaN(userId)) throw new NotFoundException('ID invalid');

    const deleted = this.usersService.deleteUser(userId);
    if (!deleted) throw new NotFoundException('Utilizator nu a fost găsit');

    return {
      success: true,
      message: 'Utilizator șters cu succes',
    };
  }
}
