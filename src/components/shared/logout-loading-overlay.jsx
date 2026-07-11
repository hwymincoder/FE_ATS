export function LogoutLoadingOverlay({ show }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-5 rounded-lg border bg-background px-10 py-8 shadow-lg">
        <div className="loader" aria-hidden="true" />
        <p className="text-sm font-medium text-muted-foreground">Đang đăng xuất...</p>
      </div>
    </div>
  );
}
