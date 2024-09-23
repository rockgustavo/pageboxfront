interface titleProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title = "VALOR DEFAULT", subtitle }: titleProps) {
  return (
    <header className="header">
      <h1 className="header-title">{title}</h1>
      <h2>{subtitle}</h2>
    </header>
  );
}
