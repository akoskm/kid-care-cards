export async function GET() {
  const healthCheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    stripe: {
      configured: !!process.env.STRIPE_SECRET_KEY && !!process.env.STRIPE_WEBHOOK_SECRET
    }
  };

  return new Response(JSON.stringify(healthCheck), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}