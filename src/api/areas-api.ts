import { apiClient } from './client';

export interface AreaDto {
  id: string;
  city?: string;
  street?: string;
  house?: string;
  flat?: string;
  [key: string]: unknown;
}

interface AreasApiRawResponse {
  results?: AreaDto[];
  items?: AreaDto[];
}

export async function getAreasByIds(ids: string[]): Promise<AreaDto[]> {
  if (ids.length === 0) {
    return [];
  }

  const params = new URLSearchParams({
    id_in: ids.join(','),
  });

  const { data } = await apiClient.get<AreasApiRawResponse | AreaDto[]>(
    `/areas?${params.toString()}`,
  );

  if (Array.isArray(data)) {
    return data;
  }

  return data.results ?? data.items ?? [];
}
