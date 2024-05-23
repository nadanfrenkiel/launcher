// CommonJs
const fastify = require('fastify')({
	logger: true
})

const { dir } = require('node:console');
const fsPath = require("node:path");

const fs = require('node:fs').promises;


const GAMES_FOLDER = 'X:\\X   GAMES\\steamapps\\common';
const IGNORE_LIST = [
	/unitycrashhandler/i
]

function isIgnored(igno) {
	for (let i = 0; i < IGNORE_LIST.length; i++) {
		if (IGNORE_LIST[i].test(igno)) {
			return true;
		}
	}
	return false;
}
function toList(arr) {
	const items = arr.map(s => `<li><a onclick="run('${s}')" href="#">${s}!</a></li>`);
	return `<ul>${items.join('')}</ul>`
}

function normalize(str) {
	return str.toLowerCase().replace(/\s/g, "");
}



/**
 * Returns the full path of the executable under the provided folder, empty string if not found
 * @param {*} target 
 */

async function findExecutable(target) {
	var exe = await executeTheExe(target, normalize(target))
	exe = await finalFilter(exe, target);
	return (exe);
	// 2. If we got here, no exe was found in the folder. Iterate on the files and recursively call the filter func
}

async function executeTheExe(targetFolder, targetName) {
	const dirArr = [],
		exeArr = [],
		count = 0;
	//	const targName = targetFolder.name;
	const path = fsPath.resolve(GAMES_FOLDER, targetFolder);
	const files = await fs.readdir(path, { withFileTypes: true });
	// 1. iterate on the files. If we find a relevant exe, return the full path

	/** Filters -
	 *  if isn't .exe - skip
	 * if includes game name (case and whitespace insensitive) - choose
	 * if all others haven't worked and it inclues "lanucher" - choose 
	 */
	for (let i = 0, len = files.length; i < len; ++i) {
		var found;
		const current = files[i],
			name = current.name;
		if (current.isDirectory()) {
			dirArr.push(current);
			continue
		}
		if (isIgnored(name)) {
			continue;
		}
		const ext = fsPath.extname(name);
		if (ext !== ".exe") {
			//filter out anything that isn't .exe
			continue
		}
		const normOrig = normalize(targetName),
			normNew = normalize(fsPath.basename(name, '.exe'))
		if (normNew.indexOf(normOrig) >= 0 || normOrig.indexOf(normNew) >= 0) {
			//contains the name of the folder AKA "target"
			const found = `${targetFolder}\\${files[i].name}`;
			return (found)
		}
		exeArr.push(current);
	}


	/*
	Problems to solve -
	1.X when checking for game name in folder name check for the ORIGINAL folder (maybe in addition) (e.g steamapps\\common\\--> hades <--). status
	2.X return full path up the chain
	
	How to (2) - return the full path for function
	base idea - return files [i] + current
	*/


	for (let i = 0; i < dirArr.length; i++) {
		// string to the start of dirArr the target folder name so it works with the current logic of findExecutable
		const save = await executeTheExe(`${targetFolder}\\${dirArr[i].name}`, targetName);
		if (Array.isArray(save)) {
			tempArr = save.map(item => `${targetFolder}\\${item}`)
			exeArr.push(...save);
		}
		else if (save) {
			return (save)
		}
	}
	return exeArr
}

async function finalFilter(input, targName) {
	if (!input) {
		return ""
	}
	if (Array.isArray(input)) {
		for (let i = 0; i < input.length; i++) {
			const subject = input[i];
			//|| subject.name.includes(targName)
			if (subject.name.includes("launcher")) {
				return subject
			}
		}
	}

	return (input);
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
	oShell.ShellExecute(tempr)
})

// Declare a route
fastify.get('/', async function (request, reply) {
	reply.type("text/html");
	const data = await fs.readFile('G:\\IQ++\\Code\\exercises\\Launcher\\htemel.html', 'utf8');
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

const fff =  findExecutable("bloonstd6").then((result)=>console.log("heyooo", result))