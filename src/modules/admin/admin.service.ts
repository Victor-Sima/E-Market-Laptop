import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';
import { Laptop } from '../../interfaces/laptop.interface';
import { User } from '../../interfaces/user.interface';

@Injectable()
export class AdminService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
  ) {}

  /** Preia un laptop pentru editare */
  getLaptopForEdit(id: number): Laptop | undefined {
    return this.productsService.getLaptopById(id);
  }

  /** Rapoarte de sistem */
  getSystemReports() {
    const allLaptops: Laptop[] = this.productsService.getAllLaptops();
    const allUsers: User[] = this.usersService.getAllUsers();

    return {
      totalProducts: allLaptops.length,
      totalUsers: allUsers.length,
      totalValue: allLaptops.reduce(
        (sum: number, laptop: Laptop) => sum + laptop.price * laptop.stock,
        0,
      ),
      outOfStock: allLaptops.filter((laptop) => laptop.stock === 0).length,
      lowStock: allLaptops.filter(
        (laptop) => laptop.stock > 0 && laptop.stock < 10,
      ).length,
      categoryBreakdown: this.getCategoryBreakdown(allLaptops),
      brandBreakdown: this.getBrandBreakdown(allLaptops),
      averagePrice: this.getAveragePrice(allLaptops),
      priceRanges: this.getPriceRanges(allLaptops),
    };
  }

  /** Statistici dashboard */
  getDashboardStats() {
    const allLaptops: Laptop[] = this.productsService.getAllLaptops();
    const totalUsers: number = this.usersService.getAllUsers().length;

    return {
      summary: {
        totalProducts: allLaptops.length,
        totalUsers: totalUsers,
        totalInventoryValue: allLaptops.reduce(
          (sum: number, laptop: Laptop) => sum + laptop.price * laptop.stock,
          0,
        ),
        availableProducts: allLaptops.filter((laptop) => laptop.isAvailable)
          .length,
      },
      alerts: {
        outOfStock: allLaptops.filter((laptop) => laptop.stock === 0),
        lowStock: allLaptops.filter(
          (laptop) => laptop.stock > 0 && laptop.stock < 5,
        ),
      },
    };
  }

  /** Actualizează stocul unui laptop */
  updateLaptopStock(id: number, newStock: number): Laptop | null {
    try {
      const updatedLaptop: Laptop | null =
        this.productsService.updateLaptopStock(id, newStock);
      return updatedLaptop;
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Error updating laptop stock:', err.message);
      }
      return null;
    }
  }

  /** Inventar complet */
  getFullInventory() {
    const allLaptops: Laptop[] = this.productsService.getAllLaptops();
    const totalValue: number = allLaptops.reduce(
      (sum: number, laptop: Laptop) => sum + laptop.price * laptop.stock,
      0,
    );
    const totalUnits: number = allLaptops.reduce(
      (sum: number, laptop: Laptop) => sum + laptop.stock,
      0,
    );

    return {
      products: allLaptops,
      summary: {
        total: allLaptops.length,
        totalValue,
        totalUnits,
      },
    };
  }

  /** --- Funcții private auxiliare --- */

  private getCategoryBreakdown(laptops: Laptop[]): Record<string, number> {
    const categories: Record<string, number> = {};
    laptops.forEach((laptop: Laptop) => {
      categories[laptop.category] = (categories[laptop.category] || 0) + 1;
    });
    return categories;
  }

  private getBrandBreakdown(laptops: Laptop[]): Record<string, number> {
    const brands: Record<string, number> = {};
    laptops.forEach((laptop: Laptop) => {
      brands[laptop.brand] = (brands[laptop.brand] || 0) + 1;
    });
    return brands;
  }

  private getAveragePrice(laptops: Laptop[]): number {
    if (laptops.length === 0) return 0;
    const total: number = laptops.reduce(
      (sum: number, laptop: Laptop) => sum + laptop.price,
      0,
    );
    return Math.round(total / laptops.length);
  }

  private getPriceRanges(laptops: Laptop[]) {
    return {
      under2000: laptops.filter((l) => l.price < 2000).length,
      '2000-5000': laptops.filter((l) => l.price >= 2000 && l.price < 5000)
        .length,
      '5000-8000': laptops.filter((l) => l.price >= 5000 && l.price < 8000)
        .length,
      over8000: laptops.filter((l) => l.price >= 8000).length,
    };
  }

  /** Creează un nou laptop (admin) */
  createLaptop(laptopData: Omit<Laptop, 'id'>): Laptop {
    return this.productsService.createLaptop(laptopData);
  }

  /** Actualizează un laptop complet (admin) */
  updateLaptop(id: number, updates: Partial<Laptop>): Laptop | null {
    return this.productsService.updateLaptop(id, updates);
  }

  /** Șterge un laptop (admin) */
  deleteLaptop(id: number): boolean {
    return this.productsService.deleteLaptop(id);
  }
}
