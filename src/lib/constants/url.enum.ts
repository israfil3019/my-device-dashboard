export const Url: { BASE: string; LOGIN: string; DATA: string } = {
  BASE:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://staging-api.arbolitics.com",
  LOGIN: "",
  DATA: "",
};

Url.LOGIN = `${Url.BASE}/auth/login`;
Url.DATA = `${Url.BASE}/data/getArboliticsDataset`;
