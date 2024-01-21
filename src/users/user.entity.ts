import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as argon from 'argon2';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  admin: boolean;

  @Column({ default: null })
  refreshToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  private tempPassword: string;

  @AfterLoad()
  private loadTempPassword() {
    this.tempPassword = this.password;
  }

  comparePassword(plainPassword: string): Promise<Boolean> {
    return argon.verify(this.password, plainPassword);
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.tempPassword !== this.password) {
      this.password = await argon.hash(this.password);
    }
  }
}
