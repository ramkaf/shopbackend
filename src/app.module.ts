import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [LoggerModule.forRootAsync({
    imports : [ConfigModule],
    useFactory:(configservice:ConfigService) => {
      const isProduction = configservice.getOrThrow('NODE_ENV') === 'production'
      return {
        pinoHttp : {
          transport : isProduction ? undefined : {
            target : 'pino-pretty',
            options : {
              singleLine : true
            }
          },
          level : isProduction ? 'info' : 'debug'
        }
      }
    },
    inject : [ConfigService]
  }
  
  ),
    ConfigModule.forRoot({
    envFilePath : './.env',
    isGlobal : true
  }),UsersModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
