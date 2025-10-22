// src/components/ui/OtpInput.tsx
import React from "react";

// Props for the OtpInput component
interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
}

// Regular expression to allow only digits. This replaces the need for the 'input-otp' package.
const REGEXP_ONLY_DIGITS = /^[0-9]+$/;

export default function OtpInput({
  value,
  onChange,
  length = 6, // Default to a 6-digit OTP
  disabled = false,
}: OtpInputProps) {
  
  // --- Event Handlers ---

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const target = e.target;
    const targetValue = target.value;

    // Do nothing if the value is not a digit
    if (!REGEXP_ONLY_DIGITS.test(targetValue) && targetValue !== "") {
      return;
    }

    const newValue = value.substring(0, index) + targetValue.slice(0, 1) + value.substring(index + 1);
    onChange(newValue);

    // If a digit was entered, move focus to the next input
    if (targetValue !== "") {
      (target.nextElementSibling as HTMLElement)?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;

    // On backspace, if the input is empty, move focus to the previous input
    if (e.key === "Backspace" && !target.value) {
      (target.previousElementSibling as HTMLElement)?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedValue = e.clipboardData
      .getData("text/plain")
      .trim()
      .slice(0, length); // Ensure pasted value doesn't exceed the OTP length

    // Only update if the pasted value contains only digits
    if (REGEXP_ONLY_DIGITS.test(pastedValue)) {
      onChange(pastedValue);
    }
  };

  // --- Rendering ---

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {Array.from({ length }).map((_, index) => (
        <input
          key={`otp-input-${index}`}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern={REGEXP_ONLY_DIGITS.source}
          maxLength={1}
          disabled={disabled}
          className="w-10 h-12 sm:w-12 sm:h-14 flex items-center justify-center text-center text-lg sm:text-xl font-semibold 
                     text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm
                     focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none
                     transition-all duration-200 ease-in-out
                     disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          value={value.charAt(index)}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={handleKeyDown} // Removed the unused 'index' from here
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
}
