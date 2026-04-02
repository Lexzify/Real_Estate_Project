function LoadingState({ text = "Loading..." }) {
  return (
    <div className="glass-panel flex items-center justify-center p-10">
      <div className="flex items-center gap-3 text-sm font-medium text-[#645d58]">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#d9d1ca] border-t-rose-500" />
        {text}
      </div>
    </div>
  );
}

export default LoadingState;
