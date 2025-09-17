import { Module } from '@nestjs/common';
import { ProductsModule } from './modules/products/products.module';
import { UsersModule } from './modules/users/users.module';
import { AdminModule } from './modules/admin/admin.module';
import { AppController } from './app.controller'; // import controller
import { AppService } from './app.service'; // import service

@Module({
  imports: [ProductsModule, UsersModule, AdminModule],
  controllers: [AppController], // adaugă aici
  providers: [AppService], // adaugă aici
})
export class AppModule {}
