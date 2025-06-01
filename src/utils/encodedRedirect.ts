import { EncoreRedirectProps } from "@/types";
import { redirect } from "next/navigation";

export const encodedRedirect = ({
	type,
	path,
	message,
}: EncoreRedirectProps) => {
	return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
};
