export interface FlutterwaveResponse {
  status: string;
  message: string;
  data?: any;
  [key: string]: any;
}

export interface FlutterwaveCardInfo {
  first_6digits: string;
  last_4digits: string;
  issuer: string;
  country: string;
  type: string;
  expiry: string;
}

export interface FlutterwaveCustomer {
  id: number;
  name: string;
  phone_number: string;
  email: string;
  created_at: string;
}

export interface FlutterwaveWebhookData {
  id: number;
  tx_ref: string;
  flw_ref: string;
  device_fingerprint: string;
  amount: number;
  currency: string;
  charged_amount: number;
  app_fee: number;
  merchant_fee: number;
  processor_response: string;
  auth_model: string;
  ip: string;
  narration: string;
  status: string;
  payment_type: string; // 'card' | 'ussd' | others
  created_at: string;
  account_id: number;
  customer: FlutterwaveCustomer;

  // Optional for USSD
  card?: FlutterwaveCardInfo;
}

export interface MetaData {
  transaction: number;
  type: string;
}

export interface FlutterwaveWebhookEvent {
  event: string; // 'charge.completed'
  data: FlutterwaveWebhookData;
  meta_data?: MetaData;
  'event.type': string; // 'CARD_TRANSACTION' | 'USSD_TRANSACTION'
}
