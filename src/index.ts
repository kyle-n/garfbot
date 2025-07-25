import { getGarf, randomGarfDate } from './helpers';
/**
 * Welcome to Cloudflare Workers!
 *
 * This is a template for a Scheduled Worker: a Worker that can run on a
 * configurable interval:
 * https://developers.cloudflare.com/workers/platform/triggers/cron-triggers/
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Run `curl "http://localhost:8787/__scheduled?cron=*+*+*+*+*"` to see your Worker in action
 * - Run `npm run deploy` to publish your Worker
 *
 * Bind resources to your Worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

async function fetch(req: Request) {
	const randomGarfDateValue = randomGarfDate();
	const comic = await getGarf(randomGarfDateValue);
	return new Response(
		`comic for ${comic.date}:\n` +
		`imageUrl: ${comic.imageUrl}\n` +
		`altText: ${comic.altText}\n`
	);
}

async function scheduled(event: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
	console.log(`Scheduled event fired at ${event.cron}`);
}

export default {
	// async fetch(req) {
		// const url = new URL(req.url);
		// url.pathname = '/__scheduled';
		// url.searchParams.append('cron', '* * * * *');
		// return new Response(`To test the scheduled handler, ensure you have used the "--test-scheduled" then try running "curl ${url.href}".`);
	// },
	fetch,
	scheduled,

	// // The scheduled handler is invoked at the interval set in our wrangler.jsonc's
	// // [[triggers]] configuration.
	// async scheduled(event, env, ctx): Promise<void> {
	// 	// A Cron Trigger can make requests to other endpoints on the Internet,
	// 	// publish to a Queue, query a D1 Database, and much more.
	// 	//
	// 	// We'll keep it simple and make an API call to a Cloudflare API:
	// 	let resp = await fetch('https://api.cloudflare.com/client/v4/ips');
	// 	let wasSuccessful = resp.ok ? 'success' : 'fail';

	// 	// You could store this result in KV, write to a D1 Database, or publish to a Queue.
	// 	// In this template, we'll just log the result:
	// 	console.log(`trigger fired at ${event.cron}: ${wasSuccessful}`);
	// },
} satisfies ExportedHandler<Env>;
