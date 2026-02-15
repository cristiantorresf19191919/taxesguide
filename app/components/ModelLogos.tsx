"use client";

import { useId } from "react";

export function ChatGPTLogo({ className = "", size = 80 }: { className?: string; size?: number }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id={`chatgpt-green-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10a37f" />
          <stop offset="100%" stopColor="#1a7f64" />
        </linearGradient>
        <linearGradient id={`chatgpt-light-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6dd3b5" />
          <stop offset="100%" stopColor="#10a37f" />
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill={`url(#chatgpt-green-${id})`} />
      <path
        fill={`url(#chatgpt-light-${id})`}
        d="M24 38c0-2.2 1.2-4 3-5.2 1.8-1.2 4.2-1.8 6.8-1.8 2.6 0 5 .6 6.8 1.8 1.8 1.2 3 3 3 5.2 0 2.2-1.2 4-3 5.2-1.8 1.2-4.2 1.8-6.8 1.8-2.6 0-5-.6-6.8-1.8-1.8-1.2-3-3-3-5.2zm22 0c0-2.2 1.2-4 3-5.2 1.8-1.2 4.2-1.8 6.8-1.8 2.6 0 5 .6 6.8 1.8 1.8 1.2 3 3 3 5.2 0 2.2-1.2 4-3 5.2-1.8 1.2-4.2 1.8-6.8 1.8-2.6 0-5-.6-6.8-1.8-1.8-1.2-3-3-3-5.2z"
        transform="translate(8 18)"
      />
      <path
        fill="white"
        fillOpacity="0.95"
        d="M28 32h-2v-2h2v2zm-6 0h-2v-2h2v2zm24 0h-2v-2h2v2zm-6 0h-2v-2h2v2z"
        transform="translate(8 18)"
      />
    </svg>
  );
}

export function GeminiLogo({ className = "", size = 80 }: { className?: string; size?: number }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id={`gemini-blue-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4285f4" />
          <stop offset="100%" stopColor="#34a853" />
        </linearGradient>
        <linearGradient id={`gemini-multi-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ea4335" />
          <stop offset="50%" stopColor="#fbbc04" />
          <stop offset="100%" stopColor="#34a853" />
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill={`url(#gemini-blue-${id})`} />
      <path
        fill="white"
        fillOpacity="0.95"
        d="M40 22L28 38h8v20h8V38h8L40 22z"
      />
      <circle cx="40" cy="52" r="4" fill={`url(#gemini-multi-${id})`} opacity="0.9" />
    </svg>
  );
}

export function ClaudeLogo({ className = "", size = 80 }: { className?: string; size?: number }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id={`claude-warm-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="50%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
        <linearGradient id={`claude-light-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill={`url(#claude-warm-${id})`} />
      <path
        fill={`url(#claude-light-${id})`}
        fillOpacity="0.95"
        d="M26 28h28c2.2 0 4 1.8 4 4v16c0 2.2-1.8 4-4 4H26c-2.2 0-4-1.8-4-4V32c0-2.2 1.8-4 4-4zm0 4v16h28V32H26zm4 6h20v4H30v-4zm0 6h14v2H30v-2z"
      />
    </svg>
  );
}
