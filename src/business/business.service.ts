import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosError } from 'axios';

@Injectable()
export class BusinessService {
  private readonly logger = new Logger(BusinessService.name);
  private readonly apiUrl = process.env.LARAVEL_API_URL!;

  private async postToApi<T = any>(
    endpoint: string,
    payload: any,
    chatId: string,
    userJwt: string,
  ): Promise<T> {
    const url = `${this.apiUrl}${endpoint}`;
    try {
      const { data } = await axios.post<T>(url, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userJwt}`, // ← MISMO token del usuario
          'X-Chat-Id': chatId,                 // (opcional) para trazabilidad
        },
        timeout: 15000,
      });
      return data;
    } catch (err) {
      const e = err as AxiosError<any>;
      this.logger.error(`POST ${endpoint} falló`, JSON.stringify(e.response?.data || e.message));
      return {
        success: false,
        message: e.response?.data?.message || `Error al consumir ${endpoint}: ${e.message}`,
        details: e.response?.data || null,
      } as any;
    }
  }

  // PERSONALES
  getHistoryFinances(date_from: string, date_to: string, chatId: string, userJwt: string) {
    return this.postToApi('/api/v1/tools/gethistoryfinances', { date_from, date_to }, chatId, userJwt);
  }
  getBuyProducts(date_from: string, date_to: string, chatId: string, userJwt: string) {
    return this.postToApi('/api/v1/tools/buyproducts', { date_from, date_to }, chatId, userJwt);
  }
  getPersonalFinances(date_from: string, date_to: string, chatId: string, userJwt: string) {
    return this.postToApi('/api/v1/tools/gethistoryfinances', { date_from, date_to }, chatId, userJwt);
  }

  // EMPRESA
  getEnterpriseFinances(date_from: string, date_to: string, chatId: string, userJwt: string) {
    return this.postToApi('/api/v1/tools/enterpriserangeexpenses', { date_from, date_to }, chatId, userJwt);
  }
}
