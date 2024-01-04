import { Body, Controller, Inject, Post } from '@nestjs/common';
import { InvitationService } from '../application/invitation.service';
import { InvitationForm } from '../dto/invitation.form';
import { ResponseEntity } from '@common/model/response.entity';
import { InvitationMemberService } from '../application/invitation-member.service';
import { MemberTypeValidationPipe } from '@common/pipe/member-type-validation.pipe';

@Controller('v1/invitation')
export class InvitationController {
  constructor(
    @Inject(InvitationMemberService)
    private readonly invitationService: InvitationService,
  ) {}

  @Post('member')
  async invite(
    @Body(MemberTypeValidationPipe) invitationForm: InvitationForm,
  ): Promise<ResponseEntity<[]>> {
    await this.invitationService.invite(invitationForm);
    return ResponseEntity.OK_WITH('초대장 전송에 성공하였습니다.');
  }
}
