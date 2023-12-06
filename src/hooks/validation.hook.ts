import { useState } from 'react';

export const ValidatedValueFactory = (regExp?: RegExp) => {
	return function useValue(
		initialValue?: string,
	): [
		{ value: string; isInvalid: boolean },
		(newValue: string) => void,
	] {
		const [value, setPureValue] = useState(initialValue ?? '');
		const [isInvalid, setIsInvalid] = useState(false);

		const setValue = (newValue: string) => {
			setPureValue(newValue);
			if (regExp) setIsInvalid(!regExp.test(newValue));
		};

		return [{ value, isInvalid }, setValue];
	};
};
