import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Laptop } from '../../interfaces/laptop.interface';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('list')
  getAllLaptops() {
    return {
      success: true,
      message: 'Lista laptopurilor',
      data: this.productsService.getAllLaptops(),
      total: this.productsService.getAllLaptops().length,
    };
  }

  @Get('details/:id')
  getLaptopDetails(@Param('id') id: string) {
    const laptopId = parseInt(id);
    if (isNaN(laptopId)) throw new NotFoundException('ID invalid');

    const laptop = this.productsService.getLaptopById(laptopId);
    if (!laptop)
      throw new NotFoundException(`Laptop cu ID ${laptopId} nu a fost găsit`);

    return { success: true, message: 'Detalii laptop', data: laptop };
  }

  @Get('search')
  searchLaptops(
    @Query('name') name?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('brand') brand?: string,
    @Query('category') category?: string,
    @Query('inStock') inStock?: string,
  ) {
    const filters = {
      name,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      brand,
      category,
      inStock: inStock === 'true',
    };

    const results = this.productsService.searchLaptops(filters);

    return {
      success: true,
      message: 'Rezultate căutare',
      filters,
      data: results,
      total: results.length,
    };
  }

  @Get('categories')
  getCategories() {
    return {
      success: true,
      message: 'Lista categoriilor',
      data: this.productsService.getCategories(),
    };
  }

  @Get('brands')
  getBrands() {
    return {
      success: true,
      message: 'Lista brandurilor',
      data: this.productsService.getBrands(),
    };
  }

  @Post()
  createLaptop(@Body() laptopData: Omit<Laptop, 'id'>) {
    const newLaptop = this.productsService.createLaptop(laptopData);
    return {
      success: true,
      message: 'Laptop creat cu succes',
      data: newLaptop,
    };
  }

  @Put(':id')
  updateLaptop(@Param('id') id: string, @Body() updates: Partial<Laptop>) {
    const laptopId = parseInt(id);
    if (isNaN(laptopId)) throw new NotFoundException('ID invalid');

    const updatedLaptop = this.productsService.updateLaptop(laptopId, updates);
    if (!updatedLaptop) throw new NotFoundException('Laptop nu a fost găsit');

    return {
      success: true,
      message: 'Laptop actualizat cu succes',
      data: updatedLaptop,
    };
  }

  @Delete(':id')
  deleteLaptop(@Param('id') id: string) {
    const laptopId = parseInt(id);
    if (isNaN(laptopId)) throw new NotFoundException('ID invalid');

    const deleted = this.productsService.deleteLaptop(laptopId);
    if (!deleted) throw new NotFoundException('Laptop nu a fost găsit');

    return {
      success: true,
      message: 'Laptop șters cu succes',
    };
  }
}
