import Image from 'next/image';
import { DialogHTMLAttributes, forwardRef, useEffect, useRef } from 'react';

interface ModalProps extends DialogHTMLAttributes<HTMLDialogElement> {
  open: boolean;
  onClose: () => void;
  linkIcon?: string;
  classNameIcon?: string;
  className?: string;
}
export const Modal = forwardRef<HTMLDialogElement, ModalProps>(
  (
    { open, children, onClose, linkIcon, classNameIcon, className, ...rest },
    ref,
  ) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    document.body.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        dialogRef.current?.close();
      }
    });

    useEffect(() => {
      if (open) {
        dialogRef.current?.showModal();
      } else {
        dialogRef.current?.close();
      }
    }, [open]);

    const handleClose = () => {
      onClose();
      dialogRef.current?.close();
    };

    return (
      <dialog
        className={`rounded-[4px] ${className}`}
        ref={dialogRef}
        {...rest}
      >
        <Image
          onClick={handleClose}
          className={`absolute top-4 right-4 cursor-pointer ${classNameIcon}`}
          src={linkIcon || '/close-icon.svg'}
          alt={'modal-close-icon'}
          width={20}
          height={20}
        />
        {children}
      </dialog>
    );
  },
);

Modal.displayName = 'Modal';
