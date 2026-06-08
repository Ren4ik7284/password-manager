import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from "typeorm";
import { User } from "../../users/user.entity";

@Entity("support_messages")
export class SupportMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  topic: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column("text")
  message: string;

  @Column({ default: "new" })
  status: string;

  @ManyToOne(() => User, { nullable: true, onDelete: "SET NULL" })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
