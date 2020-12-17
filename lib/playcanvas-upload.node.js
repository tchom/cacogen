'use strict';

const spawn = require('child_process');
const colors = require('ansi-colors');

main();

async function main() {
    try {
        const bearer = "6oLhnYDG4f7qWTQQ5bDYIq3MD10BurpP";
        const filepath = "./build/main.js";
        const branchId = "f16c88b4-9b7a-4fe7-8ce2-a62bb5046526";
        const assetId = "37148041";

        let cmd = `curl -H "Authorization: Bearer ${bearer}" -X PUT -F 'file=@${filepath}' -F 'branchId=${branchId}' https://playcanvas.com/api/assets/${assetId}`;
        console.log(colors.cyan(`Uploading ${filepath} to PlayCanvas`));
        let uploadResult = JSON.parse((spawn.execSync(cmd).toString()));
        if (uploadResult.error) {
            console.log(colors.red(`Failed to upload file ${filepath} to Playcanvas branch: ${uploadResult.error}`));
            throw uploadResult.error;
        }
        console.log(colors.green(`Done.`));
    } catch (e) {
        console.error(e);
        console.log(colors.red(`Upload failed: ${e}`));
        process.exit(1);
    }
}