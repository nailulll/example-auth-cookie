import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";
import { Repository } from "typeorm";
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from "./constants";
import * as bcrypt from "bcrypt";
import { AuthDto } from "./dto";
import { Response } from "express";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(dto: AuthDto) {
    const user = await this.userRepository.findOne({
      where: { username: dto.username },
    });

    if (!user) {
      throw new HttpException("Wrong credentials", 400);
    }

    const isValid = await bcrypt.compare(dto.password, user.password);

    if (!isValid) {
      throw new HttpException("Wrong credentials", 400);
    }

    const tokens = await this.getTokens(user.id);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  async register(dto: AuthDto) {
    const user = await this.userRepository.findOne({
      where: { username: dto.username },
    });

    if (user) {
      throw new HttpException("User with this username already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    this.userRepository.save({
      username: dto.username,
      password: hashedPassword,
    });
  }

  async refresh(token: string, response: Response) {
    try {
      const jwt = this.jwtService.verify(token, {
        secret: JWT_REFRESH_SECRET,
        algorithms: ["HS512"],
      });

      const user = await this.userRepository.findOneBy({
        id: jwt.sub,
      });

      if (!user) {
        response.clearCookie("refresh_token");
        response.clearCookie("access_token");
        throw new UnauthorizedException();
      }

      const refreshTokenMatches = bcrypt.compareSync(token, user.refreshToken);

      if (!refreshTokenMatches) {
        response.clearCookie("refresh_token");
        response.clearCookie("access_token");
        throw new UnauthorizedException();
      }

      const tokens = await this.getTokens(user.id);
      await this.updateRefreshToken(user.id, tokens.refresh_token);

      return tokens;
    } catch (err) {
      response.clearCookie("refresh_token");
      response.clearCookie("access_token");
      throw new UnauthorizedException();
    }
  }

  async logout(userId: number) {
    await this.userRepository.update({ id: userId }, { refreshToken: null });
  }

  private async getTokens(userId: number) {
    const payload = {
      sub: userId,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: JWT_ACCESS_SECRET,
        expiresIn: "15m",
        algorithm: "HS256",
      }),
      this.jwtService.signAsync(payload, {
        secret: JWT_REFRESH_SECRET,
        expiresIn: "1d",
        algorithm: "HS512",
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  private async updateRefreshToken(userId: number, token: string) {
    const hashedRefreshToken = await bcrypt.hash(token, 10);
    await this.userRepository.update(
      { id: userId },
      { refreshToken: hashedRefreshToken },
    );
  }
}
