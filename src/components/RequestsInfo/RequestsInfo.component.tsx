'use client';

import { Table } from 'semantic-ui-react';
import styles from './RequestsInfo.module.css';
import { RequestRow } from '@/components';

export interface RequestsInfoProps {
	address: string;
	requests?: IRequestInfo[];
	contributorsCount: string;
}

export interface IRequestInfo {
	description: string;
	value: string;
	recipient: string;
	approvalsCount: string;
	complete: boolean;
}

export const RequestsInfo = ({
	requests,
	address,
	contributorsCount
}: RequestsInfoProps): JSX.Element => {
	const { Header, Row, HeaderCell, Body } = Table;
	const defaultRequests: IRequestInfo[] = [
		{ description: '', value: '', recipient: '', approvalsCount: '', complete: false },
	];
	return (
		<Table>
			<Header>
				<Row>
					<HeaderCell>ID</HeaderCell>
					<HeaderCell>Description</HeaderCell>
					<HeaderCell>Amount</HeaderCell>
					<HeaderCell>Recipient</HeaderCell>
					<HeaderCell>Approval Count</HeaderCell>
					<HeaderCell>Approve</HeaderCell>
					<HeaderCell>Finalize</HeaderCell>
				</Row>
			</Header>
			<Body>
				{(requests ?? defaultRequests).map((request, index) => (
					<RequestRow
						id={index}
						request={request}
						address={address}
						key={index}
						contributorsCount={contributorsCount}
					/>
				))}
			</Body>
		</Table>
	);
};
