import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Participation } from '../../participation/domain/participation.entity';
import { BaseTimeEntity } from '@common/entities/base-time.entity';

@Entity()
export class Activity extends BaseTimeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: 0 })
  maximumParticipants: number;

  @OneToMany(() => Participation, (participation) => participation.activity)
  participation: Participation[];

  constructor();
  constructor(name: string, maximumParticipants: number);
  constructor(name?: string, maximumParticipants?: number) {
    super();
    this.name = name;
    this.maximumParticipants = maximumParticipants;
  }
}
