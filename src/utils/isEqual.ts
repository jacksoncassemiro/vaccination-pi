export const isEqual = (prev: any, current: any): boolean => {
  const isPrevPrimitive = typeof prev !== "object" || prev === null;
  const isCurrentPrimitive = typeof current !== "object" || current === null;
  const arePrimitives = isPrevPrimitive || isCurrentPrimitive;

  if (arePrimitives) return Object.is(prev, current);

  if (prev === current) return true;

  const prevKeys = Object.keys(prev);
  const currentKeys = Object.keys(current);
  const haveSameKeyCount = prevKeys.length === currentKeys.length;

  if (!haveSameKeyCount) return false;

  for (const key of prevKeys) {
    const currentHasOwnProperty = Object.prototype.hasOwnProperty.call(
      current,
      key,
    );
    const valuesAreEqual = isEqual(prev[key], current[key]);

    if (!currentHasOwnProperty || !valuesAreEqual) return false;
  }

  return true;
};
