import { api } from "@/lib/api.ts"
import type { ShortenUrlResponseType } from "@/schemas/dto/shorten-url-response-schema.tsx"
import type { ShortenUrlRequestType } from "@/schemas/dto/shorten-url-request-schema.ts"

export class UrlShortenService {
  private static readonly BASE_URL = "shortner"

  static async list(numberOfLinks: number): Promise<ShortenUrlResponseType[]> {
    const { data } = await api.get(`${this.BASE_URL}/random/${numberOfLinks}`)
    return data
  }

  static async get(uuid: string): Promise<ShortenUrlResponseType> {
    const { data } = await api.get(`${this.BASE_URL}/${uuid}`)
    return data
  }

  static async create(
    payload: ShortenUrlRequestType
  ): Promise<ShortenUrlResponseType> {
    const { data } = await api.post(`${this.BASE_URL}/`, payload)
    return data
  }

  static async update(uuid: string, payload: unknown): Promise<unknown> {
    const { data } = await api.put(`${this.BASE_URL}/${uuid}`, payload)
    return data
  }

  static async delete(uuid: string): Promise<unknown> {
    const { data } = await api.delete(`${this.BASE_URL}/${uuid}`)
    return data
  }
}
