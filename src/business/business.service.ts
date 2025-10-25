import { Injectable } from '@nestjs/common';

@Injectable()
export class BusinessService {
  async getUserBalance(userId: number) {
    // Mock temporal (simula respuesta de Laravel)
    return {
      userId,
      total: 48500,
      currency: 'MXN',
      updatedAt: new Date().toISOString(),
    };
  }

  async getExpenses(month: string, category: string) {
    // Mock temporal
    return {
      month,
      category,
      total: 23000,
      difference: '-12%',
    };
  }
}
