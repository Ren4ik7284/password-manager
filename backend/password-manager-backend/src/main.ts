import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: "http://localhost:4200",
    credentials: true,
  });

  app.use((req, res, next) => {
    const url = req.url;
    
    if (url.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    } else if (url.match(/\.(html|json)$/)) {
      res.setHeader("Cache-Control", "public, max-age=3600, must-revalidate");
    } else if (url.startsWith("/api/") || url.startsWith("/auth/")) {
      res.setHeader("Cache-Control", "no-store, private");
    } else {
      res.setHeader("Cache-Control", "public, max-age=86400");
    }
    
    next();
  });

  await app.listen(3000);
  console.log("Backend running on http://localhost:3000");
}
bootstrap();
