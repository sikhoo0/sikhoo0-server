import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../domain/user.entity';
import { Role } from '../domain/role.entity';
import { Generation } from '../../generation/domain/generation.entity';
import { EUserType } from '../domain/user-type';
import { UserRegisterResponseDto } from '../dto/user-register-response.dto';
import { UserRegisterRequestDto } from '../dto/user-register-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GenerationService } from '../../generation/application/generation.service';
import { RoleService } from '../../role/application/role.service';
import { Transactional } from 'typeorm-transactional';
import { UserStatus } from '../domain/user-status';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly roleService: RoleService,
    private readonly generationService: GenerationService,
  ) {}

  async getOneById(userId: number): Promise<User> {
    const user: User | undefined = await this.userRepository.findOneBy({
      id: userId,
    });
    if (!user) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }
    return user;
  }

  async getOneByEmail(email: string): Promise<User> {
    const user: User | undefined = await this.userRepository.findOneBy({
      email: email,
    });
    if (!user) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }
    return user;
  }

  @Transactional()
  async register(
    dto: UserRegisterRequestDto,
  ): Promise<UserRegisterResponseDto> {
    await this.validateEmailDuplication(dto.email);
    let generation: Generation | null = null;

    if (dto.memberType === EUserType.STUDENT) {
      generation = await this.generationService.getOneByGenerationNumber(
        dto.generationNumber,
      );
    }

    const role: Role = await this.roleService.getOneByName('ROLE_MEMBER');
    const user: User = User.create(
      dto.name,
      dto.email,
      dto.memberType,
      role,
      UserStatus.Activate,
      dto.password,
      generation,
    );
    const savedUser: User = await this.userRepository.save(user);
    return new UserRegisterResponseDto(savedUser.id);
  }

  private async validateEmailDuplication(email: string): Promise<void> {
    const isMemberExists: boolean = await this.userRepository.exist({
      where: {
        email: email,
      },
    });
    if (isMemberExists) {
      throw new ConflictException('이미 등록된 이메일입니다.');
    }
  }
}
