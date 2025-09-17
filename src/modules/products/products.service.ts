import { Injectable } from '@nestjs/common';
import { laptopsData } from '../../data/laptops.data';
import { Laptop } from '../../interfaces/laptop.interface';

@Injectable()
export class ProductsService {
  private readonly laptops: Laptop[] = laptopsData;

  /** Returnează toate laptopurile */
  getAllLaptops(): Laptop[] {
    return this.laptops;
  }

  /** Returnează un laptop după id */
  getLaptopById(id: number): Laptop | undefined {
    return this.laptops.find((l) => l.id === id);
  }

  /** Filtrează laptopurile după diverse criterii */
  searchLaptops(filters: {
    name?: string;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
    category?: string;
    inStock?: boolean;
  }): Laptop[] {
    return this.laptops.filter((laptop) => {
      if (
        filters.name &&
        !laptop.name.toLowerCase().includes(filters.name.toLowerCase())
      )
        return false;
      if (
        filters.brand &&
        laptop.brand.toLowerCase() !== filters.brand.toLowerCase()
      )
        return false;
      if (
        filters.category &&
        laptop.category.toLowerCase() !== filters.category.toLowerCase()
      )
        return false;
      if (filters.minPrice && laptop.price < filters.minPrice) return false;
      if (filters.maxPrice && laptop.price > filters.maxPrice) return false;
      if (filters.inStock !== undefined && filters.inStock && laptop.stock <= 0)
        return false;
      return true;
    });
  }

  /** Returnează toate categoriile disponibile */
  getCategories(): string[] {
    return Array.from(new Set(this.laptops.map((l) => l.category)));
  }

  /** Returnează toate brandurile disponibile */
  getBrands(): string[] {
    return Array.from(new Set(this.laptops.map((l) => l.brand)));
  }

  /** Actualizează stocul unui laptop */
  updateLaptopStock(id: number, stock: number): Laptop | null {
    const laptop = this.laptops.find((l) => l.id === id);
    if (!laptop) return null;
    laptop.stock = stock;
    laptop.isAvailable = stock > 0;
    return laptop;
  }

  /** Creează un nou laptop */
  createLaptop(laptopData: Omit<Laptop, 'id'>): Laptop {
    const newId =
      this.laptops.length > 0
        ? Math.max(...this.laptops.map((l) => l.id)) + 1
        : 1;
    const newLaptop: Laptop = { id: newId, ...laptopData };
    this.laptops.push(newLaptop);
    return newLaptop;
  }

  /** Actualizează un laptop existent */
  updateLaptop(id: number, updates: Partial<Laptop>): Laptop | null {
    const laptop = this.laptops.find((l) => l.id === id);
    if (!laptop) return null;
    Object.assign(laptop, updates);
    return laptop;
  }

  /** Șterge un laptop după id */
  deleteLaptop(id: number): boolean {
    const index = this.laptops.findIndex((l) => l.id === id);
    if (index === -1) return false;
    this.laptops.splice(index, 1);
    return true;
  }
}
