export default function ErrorMessage({ error }: { error?: string }) {
  return error ? <span className="ml-auto text-error">{error}</span> : null;
}
