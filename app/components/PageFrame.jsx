export function PageFrame({ children, className = "" }) {
  return (
    <main id="main-content" className={`page-frame ${className}`.trim()}>
      {children}
    </main>
  );
}
