import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
    }),
  );
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: "http://localhost:5173",
  });
  await app.listen(3000);
}
bootstrap();
