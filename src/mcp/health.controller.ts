// src/mcp/health.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller('mcp')
export class HealthController {
  @Get('health')
  health() {
    return { ok: true, ts: Date.now() };
  }
}
