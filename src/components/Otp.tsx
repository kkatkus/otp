import React, {
  useState,
  KeyboardEvent,
  ClipboardEvent,
  ChangeEvent,
  useEffect,
  HTMLAttributes,
  ForwardedRef,
} from 'react';
import styled from '@emotion/styled';

const Styled = styled.div`
  .otp {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 0.5rem;

    input {
      width: 100%;
      text-align: center;
      height: 60px;
      font-size: 26px;
      padding-left: 0;
      padding-right: 0;
    }
  }
`;

export interface OtpProps extends Omit<HTMLAttributes<HTMLInputElement>, 'ref'> {
  name: string;
  value: string;
  ref?: ForwardedRef<HTMLInputElement>;
}
export default function Otp({ id, name, value, className, style, onChange, ref, ...props }: OtpProps) {
  const [otpArr, setOtpArr] = useState<string[]>([]);

  useEffect(() => {
    setOtpArr(parseOtp(value as string));
  }, [value]);

  const idPrefix = id ?? 'otp';
  const namePrefix = name ?? 'otp';

  const parseOtp = (v: string) =>
    String(v)
      .split('')
      .filter((f) => Number.isInteger(Number(f)));
  const setFocus = (i: number) => globalThis.document.getElementById(`${idPrefix}-${i}`)?.focus();
  const idx = () => otpArr.filter((f) => !!f).length;

  const fireChange = () => {
    setTimeout(() => {
      if (onChange) {
        onChange({
          target: globalThis.document.getElementById(idPrefix)!,
        } as ChangeEvent<HTMLInputElement>);
      }
    }, 0);
  };

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.stopPropagation();
    e.preventDefault();

    const pastedText = e.clipboardData?.getData('text');
    setOtpArr(parseOtp(pastedText));
    fireChange();
    //
  }

  function handleChange(i: number, e: KeyboardEvent<HTMLInputElement>) {
    // skip paste event
    if (e.metaKey && e.key === 'v') {
      return;
    }

    if (e.key === 'Tab') {
      return;
    }

    e.stopPropagation();
    e.preventDefault();

    // arrows forward, back
    if (e.key === 'ArrowLeft') {
      if (i > 0) {
        setFocus(i - 1);
      }
      return;
    }

    if (e.key === 'ArrowRight') {
      if (i < 4) {
        setFocus(i + 1);
      }
      return;
    }

    // handle backspace
    if (e.key === 'Backspace') {
      otpArr[i] = '';
      setOtpArr([...otpArr]);

      if (i > 0) {
        otpArr[i - 1] = '';
        setOtpArr([...otpArr]);
        setFocus(i - 1);
      }
      fireChange();
      return;
    }

    if (Number.isInteger(Number(e.key))) {
      let ix = idx();
      if (ix > 5) {
        ix = 5;
      }
      otpArr[ix] = String(e.key);

      setOtpArr([...otpArr]);

      if (ix < 5) {
        setFocus(ix + 1);
      }
      fireChange();
    }
  }

  return (
    <Styled className={`${className ?? ''} kk-otp-container`} tabIndex={0}>
      <input type="hidden" name={namePrefix} id={idPrefix} value={otpArr.join('')} onChange={onChange} ref={ref} />
      <div className="kk-otp-inputs">
        {Array.from({ length: 6 }, (_, i) => (
          <input
            key={i}
            {...props}
            id={`${idPrefix}-${i}`}
            name={`${namePrefix}${i}`}
            className="kk-otp-input"
            value={otpArr[i] || ''}
            onKeyDown={(e) => handleChange(i, e)}
            maxLength={1}
            type="tel"
            onPaste={handlePaste}
            onChange={() => {
              //
            }}
          />
        ))}
      </div>
    </Styled>
  );
}
