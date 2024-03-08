import { Controller, Get, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthGuard } from "src/auth/guards";
import { GetUserId } from "./decorators";

@UseGuards(AuthGuard)
@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}

  @Get("me")
  async getMe(@GetUserId() userId: number) {
    const user = await this.userService.getById(userId);
    return {
      id: user.id,
      username: user.username,
    };
  }
}
