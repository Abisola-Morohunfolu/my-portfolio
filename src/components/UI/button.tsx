import React from 'react';

interface ButtonProps {
	clicked: () => void;
	children: React.ReactNode;
}
const Button = (props: ButtonProps) => (
	<button className="font-inherit text-primary outline-none border-none bg-transparent cursor-pointer" onClick={props.clicked}>
		{props.children}
	</button>
);

export default Button;
