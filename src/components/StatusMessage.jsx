export default function StatusMessage({ children, action }) {
  return (
    <div className="status-message" role="status">
      <span className="status-icon" aria-hidden="true">✳</span>
      <p>{children}</p>
      {action}
    </div>
  );
}
