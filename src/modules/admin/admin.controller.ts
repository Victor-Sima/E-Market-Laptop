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
import { AdminService } from './admin.service';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { Laptop } from '../../interfaces/laptop.interface';

@Controller('admin')
@UseGuards(RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // NIVEL 9: Admin endpoint pentru editare
  @Get('edit/:id')
  getLaptopForEdit(@Param('id') id: string) {
    const laptopId = parseInt(id);

    if (isNaN(laptopId)) {
      throw new NotFoundException('ID invalid');
    }

    const laptop = this.adminService.getLaptopForEdit(laptopId);

    if (!laptop) {
      throw new NotFoundException(`Laptopul cu ID ${laptopId} nu a fost găsit`);
    }

    return {
      success: true,
      message: 'Laptop pentru editare (doar admin)',
      data: laptop,
    };
  }

  // NIVEL 10: Endpoint pentru rapoarte (doar admin)
  @Get('reports')
  getReports() {
    return {
      success: true,
      message: 'Rapoarte sistem (doar admin)',
      data: this.adminService.getSystemReports(),
    };
  }

  // Dashboard admin
  @Get('dashboard')
  getDashboard() {
    return {
      success: true,
      message: 'Dashboard admin',
      data: this.adminService.getDashboardStats(),
    };
  }

  // Gestionare stoc
  @Put('stock/:id')
  updateStock(@Param('id') id: string, @Body() body: { stock: number }) {
    const laptopId = parseInt(id);
    const result = this.adminService.updateLaptopStock(laptopId, body.stock);

    if (!result) {
      throw new NotFoundException('Laptop nu a fost găsit');
    }

    return {
      success: true,
      message: 'Stoc actualizat cu succes',
      data: result,
    };
  }
  @Post()
  createLaptop(@Body() laptopData: Omit<Laptop, 'id'>) {
    const newLaptop = this.adminService.createLaptop(laptopData);
    return {
      success: true,
      message: 'Laptop creat cu succes (admin)',
      data: newLaptop,
    };
  }

  @Put(':id')
  updateLaptop(@Param('id') id: string, @Body() updates: Partial<Laptop>) {
    const laptopId = parseInt(id);
    if (isNaN(laptopId)) throw new NotFoundException('ID invalid');

    const updatedLaptop = this.adminService.updateLaptop(laptopId, updates);
    if (!updatedLaptop) throw new NotFoundException('Laptop nu a fost găsit');

    return {
      success: true,
      message: 'Laptop actualizat cu succes (admin)',
      data: updatedLaptop,
    };
  }

  @Delete(':id')
  deleteLaptop(@Param('id') id: string) {
    const laptopId = parseInt(id);
    if (isNaN(laptopId)) throw new NotFoundException('ID invalid');

    const deleted = this.adminService.deleteLaptop(laptopId);
    if (!deleted) throw new NotFoundException('Laptop nu a fost găsit');

    return {
      success: true,
      message: 'Laptop șters cu succes (admin)',
    };
  }

  // Inventar complet
  @Get('inventory')
  getInventory() {
    return {
      success: true,
      message: 'Inventar complet (doar admin)',
      data: this.adminService.getFullInventory(),
    };
  }
}
