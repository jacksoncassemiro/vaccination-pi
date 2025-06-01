import { AppAuthLayout } from "@/components";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <AppAuthLayout>{children}</AppAuthLayout>;
}
