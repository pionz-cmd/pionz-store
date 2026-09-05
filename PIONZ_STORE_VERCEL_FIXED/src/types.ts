export type AccountCategory = 'all' | 'sultan' | 'old_era' | 'evo_gun' | 'pelajar' | 'medium';

export type AccountStatus = 'ready' | 'booked' | 'sold';

export type LoginType = 'Facebook' | 'Google' | 'VK' | 'Twitter';

export type BindStatus = 'Data Polos / Monsep' | 'All Unbind (Aman)' | 'FB Nonaktif / Kait Google' | 'Full Akses Bergaransi';

export interface FFAccount {
  id: string;
  code: string;
  title: string;
  price: number;
  originalPrice?: number;
  category: AccountCategory;
  level: number;
  rank: string;
  evoGuns: string[];
  vaultCount: number;
  keyItems: string[];
  loginType: LoginType;
  bindStatus: BindStatus;
  status: AccountStatus;
  featured?: boolean;
  hotDeal?: boolean;
  images: string[];
  description: string;
  createdAt: string;
}

export interface LoginLog {
  id: string;
  timestamp: string;
  status: 'SUCCESS' | 'FAILED';
  ipInfo: string;
}

export interface StoreConfig {
  storeName: string;
  tagline: string;
  logoUrl: string;
  wa1: string;
  wa2: string;
  waChannel: string;
  instagram: string;
  announcement: string;
}
