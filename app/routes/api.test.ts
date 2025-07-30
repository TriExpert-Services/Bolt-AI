import { type ActionFunctionArgs, json } from '@remix-run/cloudflare';

export async function action({ request }: ActionFunctionArgs) {
  console.log('Test API called');
  return json({ message: 'Test API working' });
}
