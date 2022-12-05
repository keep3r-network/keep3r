import React, {useState} from 'react';
import Input from 'components/Input';
import {useKeep3r} from 'contexts/useKeep3r';
import {revoke} from 'utils/actions/revoke';
import {Button} from '@yearn-finance/web-lib/components';
import {useWeb3} from '@yearn-finance/web-lib/contexts';
import {defaultTxStatus, Transaction} from '@yearn-finance/web-lib/utils';
import {isZeroAddress} from '@yearn-finance/web-lib/utils/address';

import type {ReactElement} from 'react';

function	SectionBlacklist({chainID}: {chainID: number}): ReactElement {
	const	{provider, isActive} = useWeb3();
	const	{keeperStatus, getKeeperStatus} = useKeep3r();
	const	[blackListAddress, set_blackListAddress] = useState('');
	const	[txStatus, set_txStatus] = useState(defaultTxStatus);

	async function	onRevoke(): Promise<void> {
		if (!isActive || txStatus.pending) {
			return;
		}
		new Transaction(provider, revoke, set_txStatus)
			.populate(chainID, blackListAddress)
			.onSuccess(async (): Promise<void> => {
				await getKeeperStatus();
				set_blackListAddress('');
			})
			.perform();
	}

	return (
		<div className={'flex flex-col'}>
			<h2 className={'text-xl font-bold'}>{'BLACKLIST'}</h2>
			<div className={'mt-6'}>
				<div className={'grid grid-cols-5 gap-4'}>
					<div className={'col-span-3 flex flex-col space-y-2'}>
						<span>
							<b className={'text-black-1 hidden md:block'}>{'Blacklist keeper from network'}</b>
							<b className={'text-black-1 block md:hidden'}>{'Blacklist keeper'}</b>
						</span>
						<label aria-invalid={blackListAddress !== '' && isZeroAddress(blackListAddress)}>
							<Input
								value={blackListAddress}
								onChange={(s: unknown): void => set_blackListAddress(s as string)}
								onSearch={(s: unknown): void => set_blackListAddress(s as string)}
								aria-label={'Blacklist keeper from network'}
								placeholder={'0x...'} />
						</label>
					</div>
					<div className={'col-span-2 flex flex-col space-y-2'}>
						<b className={'text-black-1/0'}>{'-'}</b>
						<Button
							onClick={onRevoke}
							isBusy={txStatus.pending}
							isDisabled={!isActive || !keeperStatus.isGovernance || isZeroAddress(blackListAddress)}>
							{txStatus.error ? 'Blacklist failed' : txStatus.success ? 'Blacklist successful' : 'Blacklist'}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default SectionBlacklist;