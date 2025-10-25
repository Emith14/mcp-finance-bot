import { Controller, Post, Body } from '@nestjs/common';
import { BusinessService } from '../business.service';

@Controller('mcp')
export class BotController {
  constructor(private readonly businessService: BusinessService) {}

  @Post('execute')
  async executeAction(@Body() body: any) {
    const { action, params } = body;

    switch (action) {
      case 'getBalance':
        const balance = await this.businessService.getUserBalance(params.userId);
        return {
          success: true,
          message: `Balance consultado correctamente`,
          data: balance,
        };

      case 'getExpenses':
        const expenses = await this.businessService.getExpenses(params.month, params.category);
        return {
          success: true,
          message: `Gastos consultados correctamente`,
          data: expenses,
        };

      default:
        return {
          success: false,
          message: `Acción no reconocida: ${action}`,
        };
    }
  }
}
