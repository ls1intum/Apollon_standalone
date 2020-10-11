import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DiagramPermission } from '../../../../shared/diagram-permission';
import { Diagram } from './diagram';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  @Column({
    type: 'enum',
    enum: DiagramPermission,
  })
  permission: DiagramPermission;

  @ManyToOne((type) => Diagram, (diagram) => diagram.tokens)
  diagram: Diagram;
}
