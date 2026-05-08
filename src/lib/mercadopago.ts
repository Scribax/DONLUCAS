import { MercadoPagoConfig, Preference } from 'mercadopago';

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || '';

export const client = new MercadoPagoConfig({ 
  accessToken,
  options: { timeout: 5000 }
});

export const preference = new Preference(client);
