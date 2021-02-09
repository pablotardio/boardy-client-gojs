import React from "react";
import { useHistory } from "react-router-dom";
import AuthProvider from "../../providers/auth.provider";
const ButtonLoginWidget = ({ form, updateNav }) => {
	const history = useHistory();
	const handleClick = async (e) => {
		e.preventDefault();
		await login(e);
	};

	const login = async (e) => {
		try {   
            let res = await AuthProvider.login(form);
			localStorage.setItem("token", res.token);
			localStorage.setItem("vistas", JSON.stringify(res.vistas));
			updateNav();
			history.push("/home");
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<button
			type="submit"
			onClick={handleClick}
			className="btn btn-primary btn-block"
		>
			Submit
		</button>
	);
};

export default ButtonLoginWidget;
