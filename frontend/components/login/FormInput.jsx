function FormInput({ label, type = "text", placeholder, register, error, showToggle, showPassword, onToggle }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-subtle lg:text-body mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          type={showToggle ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          {...register}
          className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all lg:bg-white lg:text-heading lg:placeholder:text-subtle ${
            error
              ? "border-danger-300 focus:border-danger-400 focus:ring-danger-500/10"
              : "border-white/20 focus:border-primary-400 focus:ring-primary-500/10 lg:border-slate-200"
          } ${showToggle ? "pr-11" : ""}`}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-subtle lg:hover:text-body text-sm transition-colors cursor-pointer"
          >
            {showPassword ? "\uD83D\uDE48" : "\uD83D\uDC41\uFE0F"}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-danger-400 lg:text-danger-500 animate-fade-in">{error.message}</p>
      )}
    </div>
  );
}

export default FormInput;
