function FormInput({ label, type = "text", placeholder, register, error, showToggle, showPassword, onToggle }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-300 lg:text-slate-600 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          type={showToggle ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          {...register}
          className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all lg:bg-white lg:text-slate-900 lg:placeholder:text-slate-300 ${
            error
              ? "border-red-300 focus:border-red-400 focus:ring-red-500/10"
              : "border-white/20 focus:border-indigo-400 focus:ring-indigo-500/10 lg:border-slate-200"
          } ${showToggle ? "pr-11" : ""}`}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 lg:hover:text-slate-600 text-sm transition-colors cursor-pointer"
          >
            {showPassword ? "\uD83D\uDE48" : "\uD83D\uDC41\uFE0F"}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-400 lg:text-red-500 animate-fade-in">{error.message}</p>
      )}
    </div>
  );
}

export default FormInput;
