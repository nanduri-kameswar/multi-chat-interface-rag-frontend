type Props = {
  message?: string;
};

export function FormError({ message }: Props) {
  if (!message) return null;

  return (
    <p className="text-sm text-red-500 mb-1">
      {message}
    </p>
  );
}
