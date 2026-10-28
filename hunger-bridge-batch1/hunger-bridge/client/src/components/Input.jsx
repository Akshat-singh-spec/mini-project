export default function Input({ label, id, error, className = "", ...rest }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="field-label">
          {label}
        </label>
      )}
      <input id={id} className="input-field" {...rest} />
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
