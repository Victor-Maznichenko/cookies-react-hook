import { useCallback, useEffect, useState } from "react";

interface CookieOptions {
	expires?: string;
	"max-age"?: number;
	secure?: boolean;
	domain?: string;
	path?: string;
}

interface UseCookieProps {
	name: string;
	value?: string;
	options?: CookieOptions;
}

const defaultOptions: CookieOptions = {
	path: "/",
};

const stringifyOptions = (options: CookieOptions) => {
	let optionsStr = "";
	const arrayOptions = Object.entries(options);
	for (const optionIndex in arrayOptions) {
		const optionKey = optionIndex[0];
		const optionValue = optionIndex[1];
		optionsStr += `; ${optionKey}=${optionValue}`;
	}
	return optionsStr;
};

const useCookie = ({ name, value, options = {} }: UseCookieProps) => {
	let optionsWithDefaults: CookieOptions = {
		...defaultOptions,
		...options,
	};

	const [cookieValue, setCookieValue] = useState<string>();

	const getCookie = useCallback((): string | undefined => {
		let foundCookie;
		document.cookie.split("; ").forEach((cookie) => {
			const parts = cookie.split("=");
			if (parts[0] === name) foundCookie = decodeURIComponent(parts[1]);
		});
		return foundCookie;
	}, [name]);

	const setCookie = useCallback(
		(value: string) => {
			// Если куки с переданным имененм не существует то удаляем опцию max-age
			const isCookieExist = !!getCookie();
			if (!isCookieExist) {
				delete optionsWithDefaults["max-age"];
			}

			// Гененируем куку
			let cookieStr = encodeURIComponent(name) + "=" + encodeURIComponent(value);
			cookieStr += stringifyOptions(optionsWithDefaults);

			// Записываем куку
			document.cookie = cookieStr;
			setCookieValue(value);
		},
		[getCookie, name]
	);

	const deleteCookie = useCallback(() => {
		optionsWithDefaults = {
			"max-age": -1,
			...optionsWithDefaults,
		};
		setCookie("");
	}, [setCookie]);

	useEffect(() => {
		if (value) {
			setCookie(value);
			return;
		}
		const currentCookie = getCookie();
		if (currentCookie) setCookieValue(currentCookie);
	}, [getCookie, setCookie, value]);

	return { cookieValue, setCookie, deleteCookie };
};

export default useCookie;
