import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Generation } from '../../../modules/generation/domain/generation.entity';

@Injectable()
@ValidatorConstraint({ name: 'isGraduatedGeneration', async: true })
export class IsGraduatedGenerationConstraint
  implements ValidatorConstraintInterface
{
  constructor(
    @InjectRepository(Generation)
    private readonly generationRepository: Repository<Generation>,
  ) {}
  async validate(generationNumber: number): Promise<boolean> {
    const generation: Generation = await this.generationRepository.findOneBy({
      generationNumber: generationNumber,
    });
    return !generation?.graduated;
  }

  defaultMessage(): string {
    return 'Generation is already graduated';
  }
}

export function IsGraduatedGeneration(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (target: object, propertyKey: string) {
    registerDecorator({
      target: target.constructor,
      propertyName: propertyKey,
      options: validationOptions,
      validator: IsGraduatedGenerationConstraint,
    });
  };
}
