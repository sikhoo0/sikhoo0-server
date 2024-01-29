import { Body, Controller, Post } from '@nestjs/common';
import { SignUpForm } from '../dto/sign-up.form';
import { SignUpResponseDto } from '../dto/sign-up.response-dto';
import { ResponseEntity } from '@common/model/response.entity';
import { MemberTypeValidationPipe } from '@common/pipe/member-type-validation.pipe';
import { UserService } from '../application/user.service';

@Controller('v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async signUp(
    @Body(MemberTypeValidationPipe) form: SignUpForm,
  ): Promise<ResponseEntity<SignUpResponseDto>> {
    return ResponseEntity.OK_WITH_DATA(
      '가입 성공',
      await this.userService.signUp(
        form.name,
        form.email,
        form.memberType,
        form.generationNumber,
      ),
    );
  }
}
