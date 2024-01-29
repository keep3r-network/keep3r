/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {useEffect, useMemo, useState} from 'react';
import {usePagination, useSortBy, useTable} from 'react-table';
import IconChevronFilled from 'components/icons/IconChevronFilled';
import IconLoader from 'components/icons/IconLoader';
import {getEnv} from 'utils/env';
import axios from 'axios';
import {IconChevron} from '@yearn-finance/web-lib/icons/IconChevron';
import {truncateHex} from '@yearn-finance/web-lib/utils/address';
import {performBatchedUpdates} from '@yearn-finance/web-lib/utils/performBatchedUpdates';

import type {ReactElement, ReactNode} from 'react';

type TDisputeLogs = {
	time: number,
	keeperOrJob: string,
	action: string,
	disputer: string,
	txHash: string,
}
function LogsDispute({chainID}: {chainID: number}): ReactElement {
	const [isInit, set_isInit] = useState(false);
	const [logs, set_logs] = useState<TDisputeLogs[]>([]);

	useEffect((): void => {
		axios.get(`${getEnv(chainID).BACKEND_URI}/disputes`)
			.then((_logs): void => {
				performBatchedUpdates((): void => {
					set_logs(_logs.data || []);
					set_isInit(true);
				});
			})
			.catch((): void => set_isInit(true));
	}, [chainID]);

	const data = useMemo((): unknown[] => (
		logs.map((log): unknown => ({
			date: Intl.DateTimeFormat('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
				hour: 'numeric',
				minute: 'numeric',
				second: 'numeric'
			}).format(Number(log.time) * 1000),
			keeperOrJob: log.keeperOrJob,
			action: log.action,
			disputer: log.disputer,
			txHash: log.txHash
		}))
	), [logs]);
		
	const columns = useMemo((): unknown[] => [
		{Header: 'Date', accessor: 'date', className: 'pr-8'},
		{
			Header: 'Keeper/Job',
			accessor: 'keeperOrJob',
			className: 'cell-start pr-8',
			Cell: ({value}: {value: string}): ReactNode => truncateHex(value, 5)
		},
		{Header: 'Action', accessor: 'action', className: 'cell-start pr-8'},
		{
			Header: 'Disputer',
			accessor: 'disputer',
			className: 'cell-start pr-8',
			Cell: ({value}: {value: string}): ReactNode => truncateHex(value, 5)
		},
		{
			Header: 'Tx Hash',
			accessor: 'txHash',
			className: 'cell-start pr-6',
			Cell: ({value}: {value: string}): ReactNode => truncateHex(value, 5)
		}
	], []);

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		page,
		canPreviousPage,
		canNextPage,
		pageOptions,
		nextPage,
		previousPage,
		state: {pageIndex}
	} = useTable({columns, data, initialState: {pageSize: 50}}, useSortBy, usePagination);
	
	function renderPreviousChevron(): ReactElement {
		if (!canPreviousPage) {
			return (<IconChevron className={'h-4 w-4 cursor-not-allowed opacity-50'} />);
		}
		return (
			<IconChevron
				className={'h-4 w-4 cursor-pointer'}
				onClick={previousPage} />
		);
	}

	function renderNextChevron(): ReactElement {
		if (!canNextPage) {
			return (<IconChevron className={'h-4 w-4 rotate-180 cursor-not-allowed opacity-50'} />);
		}
		return (
			<IconChevron
				className={'h-4 w-4 rotate-180 cursor-pointer'}
				onClick={nextPage} />
		);
	}

	if (!isInit && logs.length === 0) {
		return (
			<div className={'flex h-full min-h-[112px] items-center justify-center'}>
				<IconLoader className={'h-6 w-6 animate-spin'} />
			</div>
		);
	}

	return (
		<div className={'flex w-full flex-col overflow-x-scroll'}>
			<table
				{...getTableProps()}
				className={'min-w-full overflow-x-scroll'}>
				<thead>
					{headerGroups.map((headerGroup: any): ReactElement => (
						<tr key={headerGroup.getHeaderGroupProps().key} {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map((column: any): ReactElement => (
								<th
									key={column.getHeaderProps().key}
									{...column.getHeaderProps(column.getSortByToggleProps([
										{
											className: 'pt-2 pb-8 text-left text-base font-bold whitespace-pre'
										}
									]))}>
									<div className={`flex flex-row items-center ${column.className}`}>
										{column.render('Header')}
										{column.canSort ? (
											<div className={'ml-1'}>
												{column.isSorted
													? column.isSortedDesc
														? <IconChevronFilled className={'h-4 w-4 cursor-pointer text-neutral-500'} />
														: <IconChevronFilled className={'h-4 w-4 rotate-180 cursor-pointer text-neutral-500'} />
													: <IconChevronFilled className={'h-4 w-4 cursor-pointer text-neutral-300 transition-colors hover:text-neutral-500'} />}
											</div>
										) : null}
									</div>
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody {...getTableBodyProps()}>
					{page.map((row: any): ReactElement => {
						prepareRow(row);
						return (
							<tr
								key={row.getRowProps().key}
								{...row.getRowProps()}
								className={'cursor-pointer transition-colors hover:bg-white'}
								onClick={(): void => (window as any).open(`https://${getEnv(chainID).EXPLORER}/tx/${row.values.txHash}`, '_blank')}>
								{row.cells.map((cell: any): ReactElement => {
									return (
										<td
											key={cell.getCellProps().key}
											{...cell.getCellProps([
												{
													className: `pt-2 pb-6 text-base font-mono whitespace-pre ${cell.column.className}`,
													style: cell.column.style
												}
											])
											}>
											{cell.render('Cell')}
										</td>
									);
								})}
							</tr>
						);
					})}
				</tbody>
			</table>
			{canPreviousPage || canNextPage ? (
				<div className={'flex flex-row items-center justify-end space-x-2 p-4'}>
					{renderPreviousChevron()}
					<p className={'select-none text-sm tabular-nums'}>
						{`${pageIndex + 1}/${pageOptions.length}`}
					</p>
					{renderNextChevron()}
				</div>
			) : null}
		</div>
	);
}

export default LogsDispute;
