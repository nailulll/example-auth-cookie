import {
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "./guards";
import { AuthDto, RefreshTokenDto } from "./dto";
import { AuthService } from "./auth.service";
import { Throttle } from "@nestjs/throttler";
import { Response } from "express";
import { Cookies, GetUserId } from "src/user/decorators";

@Controller("auth")
export class AuthController {
  constructor(protected authService: AuthService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post("login")
  @HttpCode(200)
  async login(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = await this.authService.login(dto);
    response.cookie("access_token", token.access_token, {
      httpOnly: true,
      sameSite: "strict",
      expires: new Date(Date.now() + 1000 * 60 * 15),
      priority: "high",
    });
    response.cookie("refresh_token", token.refresh_token, {
      httpOnly: true,
      sameSite: "strict",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1),
      priority: "high",
    });
  }

  @Post("refresh")
  @HttpCode(200)
  async refresh(
    @Cookies("refresh_token") refreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = await this.authService.refresh(refreshToken, response);
    response.cookie("access_token", token.access_token, {
      httpOnly: true,
      sameSite: "strict",
      expires: new Date(Date.now() + 1000 * 60 * 15),
      priority: "high",
    });
    response.cookie("refresh_token", token.refresh_token, {
      httpOnly: true,
      sameSite: "strict",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1),
      priority: "high",
    });
  }

  @Post("register")
  @HttpCode(200)
  async register(@Body() dto: AuthDto) {
    return this.authService.register(dto);
  }

  @UseGuards(AuthGuard)
  @Post("logout")
  @HttpCode(200)
  async logout(
    @GetUserId() userId: number,
    @Res({ passthrough: true }) response: Response,
  ) {
    response.clearCookie("refresh_token");
    response.clearCookie("access_token");
    await this.authService.logout(userId);
  }

  @Post("state")
  @HttpCode(200)
  async check(@Cookies("refresh_token") refreshToken?: string) {
    return refreshToken ? true : false;
  }
}
