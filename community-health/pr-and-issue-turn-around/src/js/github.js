const octokit = require('@octokit/rest')();
const fs = require('fs').promises;
const promptly = require('promptly');

const stdin = process.stdin;
const stdout = process.stdout;

const storeIssues = async (repositoryMeta, outputFileName) => {
	const options = octokit.issues.listForRepo.endpoint.merge(repositoryMeta);
	
	console.log("Getting results for " + repositoryMeta.repo);
	const response = await octokit.paginate(options);
	
	const fileHandle = await fs.open(outputFileName, 'w');
	await fileHandle.writeFile(JSON.stringify(response));
	await fileHandle.close();
	console.log("Succeeded for ", repositoryMeta.repo);
}

const authenticate = async () => {
	const userName = await promptly.prompt('Github username: ');
	const password = await promptly.password('Github password: ', { replace: '*' });

	octokit.authenticate({
		type: 'basic',
		username: userName,
		password: password
	});
}

const main = () => {
	storeIssues({owner: 'curl', repo: 'curl', state: 'closed', per_page: 100}, "curl_closed.json").catch(e => console.log(e.stack));
	storeIssues({owner: 'aria2', repo: 'aria2', state: 'closed', per_page: 100}, "aria2_closed.json").catch(e => console.log(e.stack));
	storeIssues({owner: 'mirror', repo: 'wget', state: 'closed', per_page: 100}, "wget_closed.json").catch(e => console.log(e.stack));
};

authenticate().then(() => {
	main();
});