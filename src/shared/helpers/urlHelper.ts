export function parseTemplateString(template: string, params: { [key: string]: string } = {}): string {
  return Object.entries(params).reduce(
    (string, [key, value]) => string.replace(new RegExp(`:${key}`, "g"), value),
    template,
  );
}
