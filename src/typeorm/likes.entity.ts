import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity()
  export class Likes {
    @PrimaryGeneratedColumn()
    id?: number;
  
    @Column({
      type: 'varchar',
    })
    userAddress: string;
  
    @Column({
      type: 'numeric',
    })
    streamId: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  }
  