import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
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

  @Column({ default: null })
  refreshToken: string;

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
