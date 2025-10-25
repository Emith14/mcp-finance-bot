import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BusinessService } from './business/business.service';
import { BotController } from './business/bot/bot.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [BotController],
  providers: [BusinessService],
})
export class AppModule {}
