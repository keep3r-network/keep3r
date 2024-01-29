import React, {useState} from 'react';
import Input from 'components/Input';
import {useKeep3r} from 'contexts/useKeep3r';
import {registerJob} from 'utils/actions';
import {getEnv} from 'utils/env';
import {Button} from '@yearn-finance/web-lib/components/Button';
import {Modal} from '@yearn-finance/web-lib/components/Modal';
import {useWeb3} from '@yearn-finance/web-lib/contexts/useWeb3';
import {IconCross} from '@yearn-finance/web-lib/icons/IconCross';
import {isZeroAddress, toAddress} from '@yearn-finance/web-lib/utils/address';
import {defaultTxStatus} from '@yearn-finance/web-lib/utils/web3/transaction';

import type {ReactElement} from 'react';

type TModalRegisterJobs = {
	chainID: number,
	isOpen: boolean,
	onClose: () => void,
}
function ModalRegisterJobs({chainID, isOpen, onClose}: TModalRegisterJobs): ReactElement {
	const {provider, isActive} = useWeb3();
	const {getJobs} = useKeep3r();
	const [jobAddress, set_jobAddress] = useState('');
	const [txStatus, set_txStatus] = useState(defaultTxStatus);

	async function onRegisterJob(): Promise<void> {
		if (!isActive || txStatus.pending || isZeroAddress(jobAddress)) {
			return;
		}
		const result = await registerJob({
			connector: provider,
			contractAddress: getEnv(chainID).KEEP3R_V2_ADDR,
			jobAddress: toAddress(jobAddress),
			statusHandler: set_txStatus
		});
		if (result.isSuccessful) {
			await getJobs();
			set_jobAddress('');
			onClose();
		}
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}>
			<div className={'space-y-4 p-6'}>
				<div className={'mb-4 flex items-center justify-between'}>
					<h2 className={'text-xl font-bold'}>{'Register job'}</h2>
					<IconCross className={'h-6 w-6 cursor-pointer text-black'} onClick={onClose} />
				</div>
				
				<div className={'pb-6'}>
					<div className={'space-y-6'}>
						<p>
							{'Anyone can register a job in the network – address is the only thing necessary. Job owner will be set to "Register job" transaction sender. Please, submit a pull request to job registry '}
							<a
								href={'https://github.com/keep3r-network/web-v2'}
								target={'_blank'}
								className={'underline'}
								rel={'noreferrer'}>
								{'repository'}
							</a>
							{' if you would like to add your job to public registry. Read '}
							<a
								href={'https://docs.keep3r.network/'}
								target={'_blank'}
								className={'underline'}
								rel={'noreferrer'}>
								{'docs'}
							</a>
							{' for more info.'}
						</p>
					</div>
				</div>

				<label
					className={'space-y-2'}
					aria-invalid={jobAddress !== '' && isZeroAddress(jobAddress)}>
					<b>{'Job contract address'}</b>
					<Input
						value={jobAddress}
						onChange={(s: unknown): void => set_jobAddress(s as string)}
						onSearch={(s: unknown): void => set_jobAddress(s as string)}
						aria-label={'address'}
						placeholder={'0x...'} />
				</label>

				<div className={'mt-8'}>
					<Button
						onClick={onRegisterJob}
						isBusy={txStatus.pending}
						isDisabled={!isActive || isZeroAddress(jobAddress)}>
						{txStatus.error ? 'Job registration failed' : txStatus.success ? 'Job registered successfully' : 'Register job'}
					</Button>
				</div>
			</div>
		</Modal>
	);
}

export {ModalRegisterJobs};
