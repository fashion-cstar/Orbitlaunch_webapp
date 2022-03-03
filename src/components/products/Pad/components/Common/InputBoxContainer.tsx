import { ReactNode } from 'react';
import styled from 'styled-components'

const Container = styled.div`
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin-top: 0px;
    }

    /* Firefox */
    input[type=number] {
    -moz-appearance: textfield;
    }

    display: flex;
    align-items: center;
`

export default function InputBoxContainer({ children }: { children: ReactNode }) {
    return (
        <Container>
            {children}
        </Container>
    )
}