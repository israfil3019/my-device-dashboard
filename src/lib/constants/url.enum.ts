const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://staging-api.arbolitics.com";

type ApiEndpoints = {
  readonly BASE: string;
  readonly LOGIN: string;
  readonly DATA: string;
};

export const Url: ApiEndpoints = {
  BASE: API_BASE_URL,
  LOGIN: `${API_BASE_URL}/auth/login`,
  DATA: `${API_BASE_URL}/data/getArboliticsDataset`,
};
