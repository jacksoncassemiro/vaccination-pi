type DeepMergeType<Target extends object, Source extends object> = {
	[Key in keyof Target | keyof Source]: Key extends keyof Source
		? Key extends keyof Target
			? Target[Key] extends object
				? Source[Key] extends object
					? DeepMergeType<Target[Key], Source[Key]> // recursivo
					: Source[Key]
				: Source[Key]
			: Source[Key]
		: Key extends keyof Target
		? Target[Key]
		: never;
};

const isObject = (obj: unknown): obj is Record<string, unknown> =>
	obj !== null && typeof obj === "object" && !Array.isArray(obj);

type DeepMergeReturn<Target extends object, Source extends object> =
	| DeepMergeType<Target, Source>
	| Target
	| Source;

export const deepMerge = <Target extends object, Source extends object>(
	target: Target,
	source: Source
): DeepMergeReturn<Target, Source> => {
	// Verificações iniciais de tipo
	const areBothObjects = isObject(target) && isObject(source);
	const isSourceArray = Array.isArray(source);
	const isTargetArray = Array.isArray(target);

	if (areBothObjects) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const result: any = {};
		let changed = false;

		// Processa propriedades existentes apenas no target
		const targetKeys = Object.keys(target);
		for (const key of targetKeys) {
			const sourceDoesNotHaveKey = !Object.prototype.hasOwnProperty.call(
				source,
				key
			);
			if (sourceDoesNotHaveKey) {
				result[key] = target[key as keyof Target];
			}
		}

		// Processa propriedades do source
		const sourceKeys = Object.keys(source);
		for (const key of sourceKeys) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const srcVal = source[key as keyof Source] as any;
			const targetHasKey = Object.prototype.hasOwnProperty.call(target, key);

			if (targetHasKey) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const tgtVal = target[key as keyof Target] as any;
				const areBothValuesObjects = isObject(tgtVal) && isObject(srcVal);
				const isSrcValArray = Array.isArray(srcVal);
				const isTgtValArray = Array.isArray(tgtVal);

				if (areBothValuesObjects) {
					const mergedVal = deepMerge(tgtVal, srcVal);
					result[key] = mergedVal;
					changed ||= mergedVal !== tgtVal;
				} else if (isSrcValArray) {
					const areEqualArrays =
						isTgtValArray &&
						srcVal.length === tgtVal.length &&
						srcVal.every((v, i) => Object.is(v, tgtVal[i]));

					if (areEqualArrays) {
						result[key] = tgtVal;
					} else {
						result[key] = [...srcVal];
						changed = true;
					}
				} else {
					const valuesAreEqual = Object.is(tgtVal, srcVal);
					result[key] = valuesAreEqual ? tgtVal : srcVal;
					changed ||= !valuesAreEqual;
				}
			} else {
				// Nova propriedade do source
				const shouldDeepClone = isObject(srcVal) && !Array.isArray(srcVal);
				result[key] = shouldDeepClone
					? deepMerge({}, srcVal)
					: Array.isArray(srcVal)
					? [...srcVal]
					: srcVal;
				changed = true;
			}
		}

		return changed ? result : target;
	}

	// Lógica para arrays
	if (isSourceArray) {
		const areEqualArrays =
			isTargetArray &&
			source.length === target.length &&
			source.every((v, i) => Object.is(v, target[i]));

		return areEqualArrays
			? target
			: ([...source] as DeepMergeReturn<Target, Source>);
	}

	// Caso padrão para primitivos
	const valuesAreEqual = Object.is(target, source);
	return valuesAreEqual ? target : source;
};
