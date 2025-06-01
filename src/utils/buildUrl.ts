import { getBaseUrl } from "@/utils";

export const buildUrl = (pathname: string = ""): string => {
	const origin = getBaseUrl();
	return new URL(pathname, origin).toString();
};
