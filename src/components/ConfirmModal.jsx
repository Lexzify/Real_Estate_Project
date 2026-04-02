function ConfirmModal({ open, title, message, onCancel, onConfirm, confirmText = "Confirm" }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111111]/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-[#ece5de] bg-white p-6 shadow-[0_26px_58px_-24px_rgba(15,23,42,0.45)]">
        <h3 className="text-xl font-bold text-[#201c19]">{title}</h3>
        <p className="mt-2 text-sm text-[#6c645f]">{message}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn-primary" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
