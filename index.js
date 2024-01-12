// CommonJs
const fastify = require('fastify')({
	logger: true
})
const fs = require('node:fs');

function toList(arr) {
	const items = arr.map(s => `<li>${s}</li>`);
	return `<ul>${items.join('')}</ul>`
}



// Declare a route
fastify.get('/', function (request, reply) {
	reply.type("text/html");
	fs.readFile('G:\\IQ++\\Code\\exercises\\Launcher\\htemel.html', 'utf8', (err, data) => {
		if (err) {
		  console.error(err);
		  return reply.send("Error opening file");
		}
		// async call the file listing
		// upon reply (assume no error):
		// replace some placeholder with a list constructed from the file listing, procesed by toList
		fs.readdir('X:\\X   GAMES\\steamapps\\common', function (err, files){
			if (!files.length) {
				return reply.send("error getting files");
			}
			console.log (files);
			const temp = toList(Array.from(files));
			const finalHTML = data.replace("work", temp);
			reply.send(finalHTML)
		})


		// const items = ["Daya", "Nadan", "Supergirl", "Superboy"];
		// const finalHTML = data.replace("work", toList(items));
		// reply.send(finalHTML)
	  });
})

// Run the server!
fastify.listen({ port: 3000 }, function (err, address) {
	if (err) {
		fastify.log.error(err)
		process.exit(1)
	}
	// Server is now listening on ${address}
})

