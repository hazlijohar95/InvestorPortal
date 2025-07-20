import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
}

export function getFileIcon(type: string): string {
  switch (type.toLowerCase()) {
    case 'pdf':
      return 'fas fa-file-pdf text-red-500';
    case 'excel':
      return 'fas fa-file-excel text-green-500';
    case 'powerpoint':
      return 'fas fa-file-powerpoint text-orange-500';
    case 'word':
      return 'fas fa-file-word text-blue-500';
    default:
      return 'fas fa-file text-gray-500';
  }
}

export function getCategoryIcon(category: string): string {
  switch (category.toLowerCase()) {
    case 'legal':
      return 'fas fa-gavel text-red-600';
    case 'financial':
      return 'fas fa-chart-bar text-green-600';
    case 'pitch':
      return 'fas fa-presentation text-blue-600';
    default:
      return 'fas fa-folder text-gray-600';
  }
}

export function getAskCategoryIcon(category: string): string {
  switch (category.toLowerCase()) {
    case 'intros':
      return 'fas fa-users text-blue-600';
    case 'hiring':
      return 'fas fa-user-tie text-green-600';
    case 'advice':
      return 'fas fa-lightbulb text-purple-600';
    default:
      return 'fas fa-question text-gray-600';
  }
}

export function getUrgencyColor(urgency: string): string {
  switch (urgency.toLowerCase()) {
    case 'high':
      return 'text-red-600';
    case 'medium':
      return 'text-yellow-600';
    case 'low':
      return 'text-green-600';
    default:
      return 'text-gray-600';
  }
}

export function getMilestoneStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'in progress':
      return 'bg-blue-100 text-blue-800';
    case 'planned':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
