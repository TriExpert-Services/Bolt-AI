import { type ActionFunctionArgs, json } from '@remix-run/cloudflare';

export async function action({ request }: ActionFunctionArgs) {
  console.log('Simple storage API called');
  
  try {
    const requestData = await request.json() as { action: string; [key: string]: any };
    console.log('Request data:', requestData);
    
    // Simple mock response for now
    return json({ success: true, message: 'API working', chats: [] });
  } catch (error) {
    console.error('Storage API error:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}
