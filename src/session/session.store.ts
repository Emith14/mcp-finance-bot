import { Injectable, Logger } from '@nestjs/common';

export type ChatSession = {
  user_jwt: string;
  exp: number; // epoch ms
};

@Injectable()
export class SessionStore {
  private readonly logger = new Logger(SessionStore.name);
  private readonly map = new Map<string, ChatSession>();
  private readonly defaultTtlSec = Number(process.env.MCP_SESSION_TTL_SEC ?? 900); // 15 min

  constructor() {
    setInterval(() => this.sweep(), 60_000).unref();
  }

  bind(chat_id: string, user_jwt: string, ttlSec?: number) {
    const ttl = (ttlSec ?? this.defaultTtlSec) * 1000;
    const exp = Date.now() + ttl;
    this.map.set(chat_id, { user_jwt, exp });
    this.logger.log(`Bind chat_id=${chat_id} ttlSec=${ttlSec ?? this.defaultTtlSec}`);
    return { success: true, expires_in: Math.floor(ttl / 1000) };
  }

  get(chat_id: string): ChatSession | null {
    const s = this.map.get(chat_id);
    if (!s) return null;
    if (s.exp < Date.now()) {
      this.map.delete(chat_id);
      return null;
    }
    return s;
  }

  refresh(chat_id: string, user_jwt?: string, ttlSec?: number) {
    const s = this.get(chat_id);
    if (!s && !user_jwt) return { success: false, message: 'No existe sesión y no se envió user_jwt' };

    const nextJwt = user_jwt ?? s!.user_jwt;
    const ttl = (ttlSec ?? this.defaultTtlSec) * 1000;
    const exp = Date.now() + ttl;
    this.map.set(chat_id, { user_jwt: nextJwt, exp });
    return { success: true, expires_in: Math.floor(ttl / 1000) };
  }

  revoke(chat_id: string) {
    this.map.delete(chat_id);
    return { success: true };
  }

  private sweep() {
    const now = Date.now();
    let deleted = 0;
    for (const [k, v] of this.map.entries()) {
      if (v.exp < now) {
        this.map.delete(k);
        deleted++;
      }
    }
    if (deleted) this.logger.log(`Sweep: ${deleted} sesiones expiradas`);
  }
}
