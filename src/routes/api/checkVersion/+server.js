// Always false — Soup Hat Dynasty does not check upstream League Page for updates.
import { json } from '@sveltejs/kit';

export async function GET() {
	return json(false);
}
