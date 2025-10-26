import { Body, Controller, Headers, Post } from '@nestjs/common';
import { BusinessService } from '../business.service';
import { SessionStore } from '../../session/session.store';
import { authOk } from '../../common/auth.util';

type ExecuteBody = {
  chat_id: string;
  action: string;
  params: { date_from: string; date_to: string };
};

@Controller('mcp')
export class BotController {
  constructor(
    private readonly business: BusinessService,
    private readonly sessions: SessionStore,
  ) {}

  @Post('execute')
  async execute(@Body() body: ExecuteBody, @Headers('authorization') appAuth?: string) {
    if (!authOk(appAuth)) {
      return { success: false, message: 'No autorizado MCP' };
    }

    const { chat_id, action, params } = body || {};
    if (!chat_id) return { success: false, message: 'chat_id es obligatorio' };
    if (!action) return { success: false, message: 'action es obligatorio' };
    if (!params?.date_from || !params?.date_to)
      return { success: false, message: 'date_from y date_to son obligatorios' };

    const session = this.sessions.get(chat_id);
    if (!session) {
      return { success: false, message: 'No hay token ligado a ese chat_id (o expiró)' };
    }
    const userJwt = session.user_jwt;

    const call = {
      // PERSONALES
      getHistoryFinances: () =>
        this.business.getHistoryFinances(params.date_from, params.date_to, chat_id, userJwt),
      getBuyProducts: () =>
        this.business.getBuyProducts(params.date_from, params.date_to, chat_id, userJwt),
      getSavingPlan: () =>
        this.business.getPersonalFinances(params.date_from, params.date_to, chat_id, userJwt),
      getRecommendations: () =>
        this.business.getPersonalFinances(params.date_from, params.date_to, chat_id, userJwt),
      getExpenseAnalysis: () =>
        this.business.getPersonalFinances(params.date_from, params.date_to, chat_id, userJwt),

      // EMPRESA
      getEnterpriseFinances: () =>
        this.business.getEnterpriseFinances(params.date_from, params.date_to, chat_id, userJwt),
      getEnterpriseRecommendations: () =>
        this.business.getEnterpriseFinances(params.date_from, params.date_to, chat_id, userJwt),
      getEnterpriseExpenseAnalysis: () =>
        this.business.getEnterpriseFinances(params.date_from, params.date_to, chat_id, userJwt),
    }[action];

    if (!call) return { success: false, message: `Acción no reconocida: ${action}` };
    return call();
  }
}
