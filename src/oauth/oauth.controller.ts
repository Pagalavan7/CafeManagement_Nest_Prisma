import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { GoogleStrategy } from './google.strategy';
import { AuthGuard } from '@nestjs/passport';
import { OauthService } from './oauth.service';

@Controller('auth')
export class OauthController {
  constructor(private readonly oauthService: OauthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // Initiates Google OAuth login; Nest will redirect automatically
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    const { googleId, email, firstName, lastName, profilePicture } = req.user;

    return await this.oauthService.getTenantByGoogleId(
      googleId,
      email,
      firstName,
      lastName,
      profilePicture,
    );
  }
}
