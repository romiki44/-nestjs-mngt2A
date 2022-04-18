import { IsString, Matches, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(3)
  username: string;
  @IsString()
  @MinLength(5)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  password: string;
}
