import { Category } from 'src/application/category/data/entities/category.entity';
import { DataSource } from 'typeorm';


export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'pgdb.cwja83i1xhvw.eu-central-1.rds.amazonaws.com',
        port: 5432,
        username: 'postgres',
        password: 'tn2.0wRfcda',
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