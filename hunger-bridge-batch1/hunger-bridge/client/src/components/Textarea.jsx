export default function Textarea({ label, id, error, className = "", ...rest }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="field-label">
          {label}
        </label>
      )}
      <textarea id={id} className="input-field min-h-[110px] resize-y" {...rest} />
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
