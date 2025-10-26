import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SessionStore } from './session/session.store';
import { SessionController } from './session/session.controller';
import { BotController } from './business/bot/bot.controller';
import { BusinessService } from './business/business.service';
import { CapabilitiesController } from './mcp/capabilities.controller';
import { HealthController } from './mcp/health.controller';



@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [SessionController, BotController, CapabilitiesController, HealthController],
  providers: [SessionStore, BusinessService],
})
export class AppModule {}
