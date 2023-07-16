import { HTMLInputTypeAttribute } from "react";

interface Props {
  name: string;
  type: HTMLInputTypeAttribute | undefined;

  className?: string;
  required?: boolean;
}
export const Input = ({ name, className, required = false, type }: Props) => {
  return (
    <input
      name={name}
      required={required}
      className={`border-2 rounded-lg ${className}`}
      type={type}
    />
  );
};
