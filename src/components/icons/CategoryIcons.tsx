import React from 'react';

interface IconProps {
  className?: string;
}

// Modern credit card icon with sleek design
export const CardIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect x="2" y="5" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2 10H22" stroke="currentColor" strokeWidth="1.5" />
    <path d="M6 15H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="18" cy="15" r="1.5" fill="currentColor" opacity="0.5" />
  </svg>
);

// Modern bolt/lightning icon for services
export const ServiceIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M13 2L4 14H12L11 22L20 10H12L13 2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Modern food/restaurant icon
export const FoodIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M18 8C18 5.79086 16.2091 4 14 4H10C7.79086 4 6 5.79086 6 8C6 10.2091 7.79086 12 10 12H14C16.2091 12 18 10.2091 18 8Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path d="M12 12V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M8 20H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="8" r="2" fill="currentColor" opacity="0.3" />
  </svg>
);

// Wallet icon for balance
export const WalletIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M3 7C3 5.34315 4.34315 4 6 4H18C19.6569 4 21 5.34315 21 7V17C21 18.6569 19.6569 20 18 20H6C4.34315 20 3 18.6569 3 17V7Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M17 12C17 13.1046 17.8954 14 19 14H21V10H19C17.8954 10 17 10.8954 17 12Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <circle cx="19" cy="12" r="1" fill="currentColor" />
    <path d="M7 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Chart/comparison icon
export const ChartIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect x="3" y="12" width="4" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="10" y="8" width="4" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="17" y="4" width="4" height="16" rx="1" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);
