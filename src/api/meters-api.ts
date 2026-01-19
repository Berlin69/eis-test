import { apiClient } from './client';

export interface MeterDto {
  id: string;
  type?: string;
  _type?: string[];
  installation_date?: string;
  area_id?: string;
  area?: { id: string; city?: string; street?: string; house?: string; flat?: string };
  is_automatic?: boolean | null;
  initial_values?: unknown;
  description?: string;
  serial_number?: string;
  communication?: string;
}

interface MetersApiRawResponse {
  results?: MeterDto[];
  items?: MeterDto[];
  count?: number;
  total?: number;
}

interface MetersTransformed {
  items: MeterDto[];
  total?: number;
}

export async function getMeters(
  limit: number,
  offset: number,
): Promise<MetersTransformed> {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });

  const { data } = await apiClient.get<MetersApiRawResponse | MeterDto[]>(
    `/meters/?${params.toString()}`,
  );

  if (Array.isArray(data)) {
    return { items: data };
  }

  const items = data.results ?? data.items ?? [];
  const total = data.total ?? data.count;

  return { items, total };
}

export async function deleteMeter(meterId: string): Promise<void> {
  await apiClient.delete(`/meters/${meterId}/`);
}
