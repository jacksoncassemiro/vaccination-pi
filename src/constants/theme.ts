import { createTheme, MantineColorsTuple } from "@mantine/core";

const deepblue: MantineColorsTuple = [
	"#e6f3ff",
	"#cee2ff",
	"#9cc2ff",
	"#66a0fe",
	"#3b83fd",
	"#2171fd",
	"#1168fe",
	"#0058e4",
	"#004ecc",
	"#0043b4",
];

export const theme = createTheme({
	colors: {
		deepblue,
	},
	fontFamily: "Open Sans, sans-serif",
	primaryColor: "deepblue",
	primaryShade: {
		light: 6,
		dark: 8,
	},
	// Removido 'scale' pois foi deprecated no v8
	autoContrast: true, // Mudado para true por padrão no v8
	luminanceThreshold: 0.3,
	defaultGradient: {
		from: "deepblue",
		to: "purple",
		deg: 45,
	},
});
