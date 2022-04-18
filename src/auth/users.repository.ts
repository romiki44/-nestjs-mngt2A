import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    //hashing
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('password', password);
    console.log('salt', salt);
    console.log('hashedPassword', hashedPassword);

    const user = this.create({
      username,
      password: hashedPassword,
    });
    try {
      await this.save(user);
    } catch (error) {
      console.log(`SignUp error ${error.code}: ${error.detail}`);
      if (error.code === '23505') {
        throw new ConflictException(`Username '${username}' is already taken.`);
      }
      throw new InternalServerErrorException(`${error.detail}`);
    }
  }
}
