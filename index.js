// CommonJs
const fastify = require('fastify')({
	logger: true
})

const fsPath = require("node:path");

const fs = require('node:fs').promises;


const GAMES_FOLDER = 'X:\\X   GAMES\\steamapps\\common';
const IGNORE_LIST = [
	/unitycrashhandler/i
]

function toList(arr) {
	const items = arr.map(s => `<li><a onclick="run('${s}')" href="#">${s}!</a></li>`);
	return `<ul>${items.join('')}</ul>`
}



/**
 * Returns the full path of the executable under the provided folder, empty string if not found
 * @param {*} target 
 */
async function findExecutable(target) {
	const path = fsPath.resolve(GAMES_FOLDER, target);
	const files = await fs.readdir(path, { withFileTypes: true });
	// 1. iterate on the files. If we find a relevant exe, return the full path
	for (let i = 0, len = files.length; i < len; ++i) {

	}
	const folders = files.filter(rec => rec.isDirectory());
	// 2. If we got here, no exe was found in the folder. Iterate on the files and recursively call the filter func
}

/*


Upon receiving a game name:
1. Locate the exe
	1. iterate on the folder with the given name, under the games folder
	2. return the first file with extension .exe and run it through a filter
2. If found and it passed the filtering, launch the exe
*/
fastify.get('/launch/:name', function (request, reply) {
	console.log("guess this works for", request.params.name);
	const tempr = findExecutable(request);
	reply.type("application/json")
		.send({ type: "game", name: request.params.name })
})

// Declare a route
fastify.get('/', async function (request, reply) {
	reply.type("text/html");
	const data = await 453.readFile('G:\\IQ++\\Code\\exercises\\Launcher\\htemel.html', 'utf8');
	// async call the file listing
	// upon reply (assume no error):
	// replace some placeholder with a list constructed from the file listing, procesed by toList
	const files = await fs.readdir(GAMES_FOLDER);
	if (!files.length) {
		return reply.send("error getting files");
	}
	console.log(files);
	const temp = toList(Array.from(files));
	const finalHTML = data.replace("work", temp);
	reply.send(finalHTML)
});



// Run the server!
fastify.listen({ port: 3000 }, function (err, address) {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
	// Server is now listening on ${address}
})

