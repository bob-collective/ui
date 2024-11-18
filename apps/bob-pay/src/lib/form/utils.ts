// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isFormDisabled = (form: any, shouldBeDirty = true): boolean => !form.isValid || (shouldBeDirty && !form.dirty);

export { isFormDisabled };
