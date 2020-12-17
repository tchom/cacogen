'use strict';

const spawn = require('child_process');
const colors = require('ansi-colors');

main();

async function main() {
    try {
        const bearer = "zbcz2rfpnurdf5ylyyb4xwzcs1n5dzp4";
        const filepath = "./build/main.js";
        const branchId = "652b37bf-8219-4e11-9255-4411e7b870d1";
        const assetId = "40123820";

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