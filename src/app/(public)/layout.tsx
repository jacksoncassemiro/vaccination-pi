import { AppPublicLayout } from "@/components";

export default function PublicLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <AppPublicLayout>{children}</AppPublicLayout>;
}
