import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

@Entity("login_attempts")
export class LoginAttempt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ default: 0 })
  attempts: number;

  @CreateDateColumn()
  lastAttemptAt: Date;

  @Column({ nullable: true })
  blockedUntil: Date;
}
