import React from "react";
import styled from "styled-components";
import { space, type SpaceProps } from "styled-system";

type CardProps = React.PropsWithChildren<SpaceProps>;

const CardBase = styled.section<CardProps>`
    background: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radii.md}px;
    box-shadow: 0 12px 30px rgba(10, 15, 24, 0.2);
    padding: 16px;
    ${space}
`;

export const Card: React.FC<CardProps> = (props) => <CardBase {...props} />;
