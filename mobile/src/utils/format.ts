const whole = new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 });

const precise = new Intl.NumberFormat("en-PK", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatCurrency = (value: number | string) =>
  `PKR ${whole.format(Number(value) || 0)}`;

export const formatCurrencyPrecise = (value: number | string) =>
  `PKR ${precise.format(Number(value) || 0)}`;

export const formatDate = (value: string | Date | null | undefined) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

export const formatMonthYear = (value: string | Date = new Date()) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

export const isSameMonth = (
  value: string | Date | null | undefined,
  reference: Date = new Date()
) => {
  if (!value) return false;
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return false;

  return (
    date.getFullYear() === reference.getFullYear() &&
    date.getMonth() === reference.getMonth()
  );
};

export const toDateInputValue = (value: string | Date = new Date()) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  return local.toISOString().slice(0, 10);
};

export const initials = (name: string = "") => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "?";

  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};
