import { ForwardedRef, HTMLAttributes } from 'react';

export interface OtpProps extends Omit<HTMLAttributes<HTMLInputElement>, 'ref'> {
  name: string;
  value: string;
  ref?: ForwardedRef<HTMLInputElement>;
}
