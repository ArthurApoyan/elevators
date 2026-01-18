import React from "react";
import styled from "styled-components";
import { layout, space, type LayoutProps, type SpaceProps } from "styled-system";

type ContainerProps = React.PropsWithChildren<LayoutProps & SpaceProps>;

const containerPropBlocklist = new Set([
    "p","pt","pr","pb","pl","px","py",
    "m","mt","mr","mb","ml","mx","my",
    "width","height","maxWidth","minWidth","maxHeight","minHeight",
]);

const ContainerBase = styled.div.withConfig({
    shouldForwardProp: (prop) => !containerPropBlocklist.has(prop),
})<ContainerProps>`
    margin-left: auto;
    margin-right: auto;
    max-width: 1100px;
    width: 100%;
    ${layout}
    ${space}
`;

export const Container: React.FC<ContainerProps> = (props) => <ContainerBase {...props} />;
