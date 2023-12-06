import { Action, Setter } from '@/types';
import { FormEvent } from 'react';

export function HandleSubmitFactory(
	action: Action,
	actionOnSuccess: Action,
	actionOnFail: Action,
	setLoading: Setter<boolean>,
): (event: FormEvent<HTMLFormElement>) => Promise<void> {
	return async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		await setLoading(true);

		try {
			await action();
			await actionOnSuccess();
		} catch (err) {
			console.error(JSON.stringify(err));
			await actionOnFail(err);
		} finally {
			await setLoading(false);
		}
	};
}
