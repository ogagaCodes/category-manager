import { Module } from '@nestjs/common';
import { CategoryProviders } from './category.providers';
import { CategoryService } from './services/category.service';
import { CategoryController } from './controllers/category.controller';
import { DatabaseModule } from 'src/infrastructure/database/database.module';


@Module({
  imports: [DatabaseModule],
  providers: [CategoryService, ...CategoryProviders],
  controllers: [CategoryController]
})
export class CategoryModule {}
