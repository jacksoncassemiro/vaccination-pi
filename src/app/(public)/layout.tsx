import { AppPublicLayout } from "@/components/AppPublicLayout";

export default function PublicLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <AppPublicLayout>{children}</AppPublicLayout>;
}
