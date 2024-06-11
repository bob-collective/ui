const isFormDisabled = (form: any, shouldBeDirty = true): boolean => !form.isValid || (shouldBeDirty && !form.dirty);

export { isFormDisabled };
