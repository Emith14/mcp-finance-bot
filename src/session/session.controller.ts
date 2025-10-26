import { Body, Controller, Headers, Post } from '@nestjs/common';
import { SessionStore } from './session.store';
import { authOk } from '../common/auth.util';

@Controller('mcp/session')
export class SessionController {
  constructor(private readonly sessions: SessionStore) {}

  @Post('bindUserToken')
  bind(
    @Body() body: { chat_id: string; user_jwt: string; ttl_sec?: number },
    @Headers('authorization') appAuth?: string,
  ) {
    if (!authOk(appAuth)) {
      return { success: false, message: 'No autorizado MCP' };
    }
    const { chat_id, user_jwt, ttl_sec } = body || {};
    if (!chat_id || !user_jwt) {
      return { success: false, message: 'chat_id y user_jwt son obligatorios' };
    }
    return this.sessions.bind(chat_id, user_jwt, ttl_sec);
  }

  @Post('refresh')
  refresh(
    @Body() body: { chat_id: string; user_jwt?: string; ttl_sec?: number },
    @Headers('authorization') appAuth?: string,
  ) {
    if (!authOk(appAuth)) {
      return { success: false, message: 'No autorizado MCP' };
    }
    const { chat_id, user_jwt, ttl_sec } = body || {};
    if (!chat_id) return { success: false, message: 'chat_id es obligatorio' };
    return this.sessions.refresh(chat_id, user_jwt, ttl_sec);
  }

  @Post('revoke')
  revoke(@Body() body: { chat_id: string }, @Headers('authorization') appAuth?: string) {
    if (!authOk(appAuth)) {
      return { success: false, message: 'No autorizado MCP' };
    }
    const { chat_id } = body || {};
    if (!chat_id) return { success: false, message: 'chat_id es obligatorio' };
    return this.sessions.revoke(chat_id);
  }
}
