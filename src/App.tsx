import { ChangeEvent, useState } from "react";
import "./assets/styles/App.css";
import useCookie from "./hooks/useCookie";

function App() {
	const [value, setValue] = useState("");
	const { cookieValue, setCookie, deleteCookie } = useCookie({
		name: "login",
		options: {
			"max-age": 2,
		},
	});

	const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
		setValue(target.value);
		setCookie(target.value);
	};

	const handleClick = () => {
		setValue("");
		deleteCookie();
	};

	return (
		<>
			<h1>Cookie</h1>
			<div>
				<b>login:</b> {cookieValue}
			</div>
			<div>
				<b>document.cookie:</b> {document.cookie}
			</div>
			<input type="text" placeholder="Your login" value={value} onChange={handleChange} />
			<button type="button" onClick={handleClick}>
				delete cookie login
			</button>
		</>
	);
}

export default App;
