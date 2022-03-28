import { ReactNode } from 'react';

export default function InputBoxContainer({ children }: { children: ReactNode }) {
    return (
        <div>
            <form autoComplete="off">
                {children}
            </form>
        </div>
    )
}