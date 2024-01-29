import React, {useCallback, useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import Input from 'components/Input';
import {useJob} from 'contexts/useJob';
import {useKeep3r} from 'contexts/useKeep3r';
import KEEP3RV2_ABI from 'utils/abi/keep3rv2.abi';
import {acceptJobMigration, migrateJob} from 'utils/actions';
import {getEnv} from 'utils/env';
import {zeroAddress} from 'viem';
import {readContracts} from 'wagmi';
import {Button} from '@yearn-finance/web-lib/components/Button';
import {Modal} from '@yearn-finance/web-lib/components/Modal';
import {useWeb3} from '@yearn-finance/web-lib/contexts/useWeb3';
import {IconCross} from '@yearn-finance/web-lib/icons/IconCross';
import {isZeroAddress, toAddress} from '@yearn-finance/web-lib/utils/address';
import {decodeAsAddress, decodeAsBoolean} from '@yearn-finance/web-lib/utils/decoder';
import {defaultTxStatus} from '@yearn-finance/web-lib/utils/web3/transaction';

import type {ReactElement} from 'react';
import type {TAddress} from '@yearn-finance/web-lib/types';

type TJobToStatus = {hasDispute: boolean, owner: TAddress}
type TModalMigrate = {
	currentAddress: TAddress,
	chainID: number,
	isOpen: boolean,
	onClose: () => void,
}

const defaultJobToStatus = {hasDispute: false, owner: zeroAddress};
function ModalMigrate({currentAddress, chainID, isOpen, onClose}: TModalMigrate): ReactElement {
	const router = useRouter();
	const {provider, address, isActive} = useWeb3();
	const {jobStatus, getJobStatus} = useJob();
	const {getJobs, getKeeperStatus} = useKeep3r();
	const [newAddress, set_newAddress] = useState('');
	const [jobToStatus, set_jobToStatus] = useState<TJobToStatus>(defaultJobToStatus);
	const [txStatusMigrate, set_txStatusMigrate] = useState(defaultTxStatus);
	const [txStatusAccept, set_txStatusAccept] = useState(defaultTxStatus);
	const [time, set_time] = useState(0);

	const goDown = useCallback(async (): Promise<void> => {
		if (time > 0) {
			setTimeout((): void => {
				set_time(time - 1);
			}, 1000);
		}
	}, [time]);

	useEffect((): void => {
		goDown();
	}, [goDown]);

	async function getMigrationDestination(migrationAddress: TAddress): Promise<void> {
		const results = await readContracts({
			contracts: [
				{address: toAddress(getEnv(chainID).KEEP3R_V2_ADDR), abi: KEEP3RV2_ABI, functionName: 'disputes', args: [migrationAddress]},
				{address: toAddress(getEnv(chainID).KEEP3R_V2_ADDR), abi: KEEP3RV2_ABI, functionName: 'jobOwner', args: [migrationAddress]}
			]
		});
		set_jobToStatus({hasDispute: decodeAsBoolean(results[0]), owner: decodeAsAddress(results[1])});
	}
	
	useEffect((): void => {
		if (!isZeroAddress(jobStatus.pendingJobMigrations)) {
			set_newAddress(jobStatus.pendingJobMigrations);
			getMigrationDestination(jobStatus.pendingJobMigrations);
		}
	}, [jobStatus.pendingJobMigrations]);

	async function onMigrateJob(): Promise<void> {
		if (!isActive || txStatusMigrate.pending) {
			return;
		}
		const result = await migrateJob({
			connector: provider,
			contractAddress: getEnv(chainID).KEEP3R_V2_ADDR,
			oldJobAddress: toAddress(currentAddress),
			newJobAddress: toAddress(newAddress),
			statusHandler: set_txStatusMigrate
		});
		if (result.isSuccessful) {
			await Promise.all([getJobStatus(), getKeeperStatus()]);
			set_time(60);
		}
	}

	async function onAcceptMigration(): Promise<void> {
		if (!isActive || txStatusAccept.pending) {
			return;
		}
		const result = await acceptJobMigration({
			connector: provider,
			contractAddress: getEnv(chainID).KEEP3R_V2_ADDR,
			oldJobAddress: toAddress(currentAddress),
			newJobAddress: toAddress(newAddress),
			statusHandler: set_txStatusAccept
		});
		if (result.isSuccessful) {
			await Promise.all([getJobStatus(), getJobs(), getKeeperStatus()]);
			set_newAddress('');
			onClose();
			router.push(`/jobs/${newAddress}`);
		}
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}>
			<div className={'space-y-4 p-6'}>
				<div className={'mb-4 flex items-center justify-between'}>
					<h2 className={'text-xl font-bold'}>{'Migrate job'}</h2>
					<IconCross className={'h-6 w-6 cursor-pointer text-black'} onClick={onClose} />
				</div>

				<div className={'flex flex-col'}>
					<div className={'mb-6 space-y-6'}>
						<p>
							{'A proper migration implies current job state – tokens, liquidities, period credits - is transferred from current to new job.'}
						</p>
						<div>
							<p>{'This process requires 2 steps:'}</p>
							<p>{'1. Initiate job migration – done by current job owner.'}</p>
							<p>{'2. Accept job migration – done by new job owner.'}</p>
						</div>
						<p>
							<b>{'Note:'}</b>
							{' Neither of the jobs should be disputed. There should be at least one minute pause between migration steps.'}
						</p>
					</div>
					<div className={'mb-6 space-y-2'}>
						<b className={'text-black-1'}>{'Current address'}</b>
						<div className={'overflow-hidden border border-grey-1 px-4 py-3'}>
							<p className={'overflow-hidden text-ellipsis text-grey-1'}>{currentAddress}</p>
						</div>
					</div>
					<label
						className={'space-y-2'}
						aria-invalid={
							newAddress !== '' && isZeroAddress(newAddress)
							|| toAddress(newAddress) === toAddress(currentAddress)
						}>
						<b className={'text-black-1'}>{'New address'}</b>
						<Input
							value={newAddress}
							onChange={(s: unknown): void => set_newAddress(s as string)}
							onSearch={(s: unknown): void => set_newAddress(s as string)}
							aria-label={'new address'}
							placeholder={'0x...'} />
					</label>
					<div className={'mt-8 grid grid-cols-2 gap-4'}>
						<Button
							onClick={onMigrateJob}
							isBusy={txStatusMigrate.pending}
							isDisabled={
								isZeroAddress(newAddress)
								|| jobStatus.jobOwner !== address
								|| toAddress(newAddress) === toAddress(jobStatus.pendingJobMigrations)
								|| toAddress(newAddress) === toAddress(currentAddress)
							}>
							{txStatusMigrate.error ? 'Migration failed' : txStatusMigrate.success ? 'Migration initialized' : 'Initiate migration'}
						</Button>

						<Button
							onClick={onAcceptMigration}
							isBusy={txStatusAccept.pending}
							isDisabled={
								isZeroAddress(jobStatus.pendingJobMigrations)
								|| jobToStatus.owner !== address
								|| jobToStatus.hasDispute || jobStatus.hasDispute
								|| time > 0
							}>
							{time > 0 ? time : txStatusAccept.error ? 'Migration failed' : txStatusAccept.success ? 'Migration successful' : 'Accept'}
						</Button>
					</div>
				</div>
			</div>
		</Modal>
	);
}

export {ModalMigrate};
