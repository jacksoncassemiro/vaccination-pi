export type FilteredProps<
	T,
	Mode extends "exclude" | "include" = "include",
	K extends keyof T = keyof T
> = Mode extends "exclude" ? Omit<T, K> : Pick<T, K>;

export type MakeSomeOptional<T, K extends keyof T> = Omit<T, K> &
	Partial<Pick<T, K>>;
export type MakeSomeRequired<T, K extends keyof T> = Omit<T, K> &
	Required<Pick<T, K>>;

export type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
