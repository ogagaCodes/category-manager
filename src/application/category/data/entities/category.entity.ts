import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Category, category => category.parent)
  children: Category[];

  @ManyToOne(() => Category, category => category.children)
  parent: Category;
}