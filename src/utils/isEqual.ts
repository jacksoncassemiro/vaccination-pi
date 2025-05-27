export const isEqual = (prev: unknown, current: unknown): boolean => {
  const isPrevPrimitive = typeof prev !== "object" || prev === null;
  const isCurrentPrimitive = typeof current !== "object" || current === null;
  const arePrimitives = isPrevPrimitive || isCurrentPrimitive;

  if (arePrimitives) return Object.is(prev, current);

  if (prev === current) return true;

  // Type guard para objetos
  if (typeof prev !== "object" || typeof current !== "object" || prev === null || current === null) {
    return false;
  }

  // Casting para Record<string, unknown> após verificação
  const prevObj = prev as Record<string, unknown>;
  const currentObj = current as Record<string, unknown>;

  const prevKeys = Object.keys(prevObj);
  const currentKeys = Object.keys(currentObj);
  const haveSameKeyCount = prevKeys.length === currentKeys.length;

  if (!haveSameKeyCount) return false;

  for (const key of prevKeys) {
    const currentHasOwnProperty = Object.prototype.hasOwnProperty.call(
      currentObj,
      key,
    );
    const valuesAreEqual = isEqual(prevObj[key], currentObj[key]);

    if (!currentHasOwnProperty || !valuesAreEqual) return false;
  }

  return true;
};
