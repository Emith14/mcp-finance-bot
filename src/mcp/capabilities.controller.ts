import { Controller, Get, Headers } from '@nestjs/common';
import { authOk } from '../common/auth.util';

@Controller('mcp')
export class CapabilitiesController {
  @Get('capabilities')
  getCapabilities(@Headers('authorization') appAuth?: string) {
    if (!authOk(appAuth)) {
      return { success: false, message: 'No autorizado MCP' };
    }

    return {
      success: true,
      actions: [
        {
          action: 'getHistoryFinances',
          group: 'personal',
          description: 'Movimientos detallados por rango',
          params: { date_from: 'YYYY-MM-DD', date_to: 'YYYY-MM-DD' }
        },
        {
          action: 'getBuyProducts',
          group: 'personal',
          description: 'Compras/productos por rango',
          params: { date_from: 'YYYY-MM-DD', date_to: 'YYYY-MM-DD' }
        },
        {
          action: 'getSavingPlan',
          group: 'personal',
          description: 'Datos base para crear plan de ahorro',
          params: { date_from: 'YYYY-MM-DD', date_to: 'YYYY-MM-DD' }
        },
        {
          action: 'getRecommendations',
          group: 'personal',
          description: 'Datos base para recomendaciones personales',
          params: { date_from: 'YYYY-MM-DD', date_to: 'YYYY-MM-DD' }
        },
        {
          action: 'getExpenseAnalysis',
          group: 'personal',
          description: 'Análisis de gastos por rango',
          params: { date_from: 'YYYY-MM-DD', date_to: 'YYYY-MM-DD' }
        },
        {
          action: 'getEnterpriseFinances',
          group: 'empresa',
          description: 'Movimientos empresa por rango',
          params: { date_from: 'YYYY-MM-DD', date_to: 'YYYY-MM-DD' }
        },
        {
          action: 'getEnterpriseRecommendations',
          group: 'empresa',
          description: 'Datos base para recomendaciones empresariales',
          params: { date_from: 'YYYY-MM-DD', date_to: 'YYYY-MM-DD' }
        },
        {
          action: 'getEnterpriseExpenseAnalysis',
          group: 'empresa',
          description: 'Análisis de gastos empresariales',
          params: { date_from: 'YYYY-MM-DD', date_to: 'YYYY-MM-DD' }
        }
      ]
    };
  }
}
