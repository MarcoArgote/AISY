// Servicio de Stripe para checkout

import { loadStripe } from '@stripe/stripe-js';

let stripePromise;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  }
  return stripePromise;
};

export async function createCheckout(beatId, licenseType, beatTitle) {
  try {
    const response = await fetch('/api/checkout/create-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        beatId,
        licenseType,
        beatTitle
      })
    });

    if (!response.ok) {
      throw new Error('Error al crear sesión de pago');
    }

    const { sessionId } = await response.json();
    const stripe = await getStripe();
    
    // Redirigir a Stripe Checkout
    const { error } = await stripe.redirectToCheckout({ sessionId });
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error en checkout:', error);
    throw error;
  }
}

export default {
  createCheckout
};
