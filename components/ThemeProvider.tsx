const backGroundStyle = {
  backgroundColor: '#f5f1e6',
  color: '#f26e22',
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <div className="bg-orange-50">{children}</div>;
}
