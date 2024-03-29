import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Participation } from '../../participation/domain/participation.entity';
import { BaseTimeEntity } from '@common/model/base-time.entity';

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
}
