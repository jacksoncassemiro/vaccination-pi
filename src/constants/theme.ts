import { createTheme, MantineColorsTuple } from "@mantine/core";

const deepblue: MantineColorsTuple = [
	"#ecefff",
	"#d5dafb",
	"#a9b1f1",
	"#7a87e9",
	"#5362e1",
	"#3a4bdd",
	"#2c40dc",
	"#1f32c4",
	"#182cb0",
	"#0a259c",
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
	scale: 1,
	autoContrast: false,
	luminanceThreshold: 0.3,
	defaultGradient: {
		from: "deepblue",
		to: "purple",
		deg: 45,
	},
});
