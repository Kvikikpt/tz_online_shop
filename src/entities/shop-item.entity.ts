import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export interface IShopItemEntity {
  id: number;
  name: string;
  price: number;
  weight: number;
  startDate: Date;
  endDate: Date;
}

@Entity()
export class ShopItemEntity implements IShopItemEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id!: number;

  @Column({
    name: 'name',
    type: 'character varying',
    length: 255,
    nullable: false,
    unique: true,
  })
  name!: string;

  @Column({
    name: 'price',
    type: 'integer',
    nullable: false,
  })
  price!: number;

  @Column({
    name: 'weight',
    type: 'integer',
    nullable: false,
  })
  weight!: number;

  @Column({
    name: 'start_date',
    type: 'timestamp',
    nullable: false,
  })
  startDate!: Date;

  @Column({
    name: 'end_date',
    type: 'timestamp',
    nullable: false,
  })
  endDate!: Date;
}
