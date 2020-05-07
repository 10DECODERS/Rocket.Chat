import { fork } from 'child_process';

import { Migrations } from '../../../app/migrations/server';
import { getLocalSrc } from '../../../app/events/server/lib/getLocalSrc';
import { getFederationDomain } from '../../../app/federation/server/lib/getFederationDomain';

Migrations.add({
	version: 190,
	up() {
		Promise.await(new Promise((resolve, reject) => {
			const prc = fork(Assets.absoluteFilePath('migrations/v190/v1ToV2.js'), {
				env: {
					LOCAL_SRC: getLocalSrc(),
					FEDERATION_DOMAIN: getFederationDomain(),
					MONGO_URL: process.env.MONGO_URL,
				},
			});

			prc.on('exit', function(code) {
				console.log(`process exit code ${ code }`);

				if (code === 0) {
					resolve();
				} else {
					reject('Error running external script');
				}
			});
		}));
	},
	down() {
		// Once you go 175 you never go back
	},
});
