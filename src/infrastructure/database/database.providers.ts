import { Category } from 'src/application/category/data/entities/category.entity';
import { DataSource } from 'typeorm';


export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: '*****',
        port: *****,
        username: '*****',
        password: '*****',
        database: 'testdb',
        entities: [
            Category,
        ],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
