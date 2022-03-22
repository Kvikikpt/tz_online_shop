import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export interface IUserEntity {
  id: number;
  name: string;
  password: string;
  isAdmin: boolean;
  createdAt: Date;
  salt: string;
}

@Entity()
export class UserEntity implements IUserEntity {
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
    name: 'password',
    type: 'character varying',
    length: 255,
    nullable: false,
  })
  password!: string;

  @Column({
    name: 'is_admin',
    type: 'boolean',
    nullable: false,
  })
  isAdmin!: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt!: Date;

  @Column({
    name: 'salt',
    type: 'character varying',
    length: 21,
    nullable: false,
  })
  salt!: string;
}
