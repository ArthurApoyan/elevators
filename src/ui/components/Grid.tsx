import React from "react";
import styled from "styled-components";
import { grid, space, type GridProps, type SpaceProps } from "styled-system";

type StyledGridProps = React.PropsWithChildren<GridProps & SpaceProps>;

const gridPropBlocklist = new Set([
    "gridTemplateColumns",
    "gridTemplateRows",
    "gridTemplateAreas",
    "gridAutoColumns",
    "gridAutoRows",
    "gridAutoFlow",
    "gridGap",
    "gridRowGap",
    "gridColumnGap",
    "gap",
]);

const GridBase = styled.div.withConfig({
    shouldForwardProp: (prop) => !gridPropBlocklist.has(prop),
})<StyledGridProps>`
    display: grid;
    ${grid}
    ${space}
`;

export const Grid: React.FC<StyledGridProps> = (props) => <GridBase {...props} />;
