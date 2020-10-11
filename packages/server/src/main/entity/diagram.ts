import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { DiagramDTO } from '../../../../shared/diagram-dto';
import { Token } from './token';

@Entity()
export class Diagram {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('simple-json')
  diagram: DiagramDTO;

  @OneToMany((type) => Token, (token) => token.diagram)
  tokens: Token[];
}
