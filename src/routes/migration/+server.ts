import { json, type RequestHandler } from "@sveltejs/kit";


export const POST: RequestHandler = async ({ request }) => {
	const myJson = await request.json();
	console.log(myJson)
    return json('')
};

