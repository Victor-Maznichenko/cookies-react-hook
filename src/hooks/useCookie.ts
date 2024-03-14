import { useCallback, useEffect, useRef, useState } from "react";

interface CookieOptions {
	expires?: string;
	"max-age"?: number;
	secure?: boolean;
	domain?: string;
	path?: string;
}

interface UseCookieData {
	name: string;
	value?: string;
	options: CookieOptions;
}

const useCookie = ({ name, value, options = {} }: UseCookieData) => {
	const optionsRef = useRef(options);
	const [cookieValue, setCookieValue] = useState<string>();

	const getCookie = useCallback((): string | undefined => {
		const matches = document.cookie.match(
			new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\/\+^])/g, "$1") + "=([^;]*)")
		);
		return matches ? decodeURIComponent(matches[1]) : undefined;
	}, [name]);

	const setCookie = useCallback(
		(value: string) => {
			const defaultOptions = {
				path: "/",
				...optionsRef.current,
			};

			if (!getCookie()) {
				delete defaultOptions["max-age"];
			}

			let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

			for (const optionKey in defaultOptions) {
				updatedCookie += "; " + optionKey;
				const optionValue = defaultOptions[optionKey];
				if (optionValue !== true) {
					updatedCookie += "=" + optionValue;
				}
			}

			document.cookie = updatedCookie;
			setCookieValue(value);
		},
		[getCookie, name]
	);

	const deleteCookie = useCallback(() => {
		optionsRef.current = {
			"max-age": -1,
			...optionsRef.current,
		};
		setCookie("");
	}, [setCookie]);

	useEffect(() => {
		if (value) {
			setCookie(value);
		} else if (getCookie()) {
			setCookieValue(getCookie());
		} else {
			setCookieValue("");
		}
	}, [getCookie, setCookie, value]);

	return { cookieValue, setCookie, deleteCookie };
};

export default useCookie;
