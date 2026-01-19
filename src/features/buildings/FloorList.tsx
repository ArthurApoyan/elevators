import styled, { keyframes, css } from 'styled-components';

const Floors = styled.div`
  display: grid;
  gap: 8px;
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(112, 189, 23, 0.3);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(112, 189, 23, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(112, 189, 23, 0);
  }
`;

const queueGlow = keyframes`
  0% {
    transform: scale(0.9);
    opacity: 0.6;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
`;

const FloorRow = styled.button<{ $active: boolean; $queued: boolean }>`
    align-items: center;
    background: ${({theme}) => theme.colors.surface};
    border: 1px solid ${({theme}) => theme.colors.border};
    border-radius: ${({theme}) => theme.radii.md}px;
    color: ${({theme}) => theme.colors.text};
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    padding: 10px 12px;
    text-align: left;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease,
    background 0.2s ease;

    ${({$active, theme}) =>
            $active &&
            css`
                border-color: ${theme.colors.accent};
                background: rgba(112, 189, 23, 0.12);
                animation: ${pulse} 1.1s ease;
            `}
    ${({$queued}) =>
            $queued &&
            css`
                border-color: rgba(112, 189, 23, 0.45);
                box-shadow: 0 0 0 1px rgba(112, 189, 23, 0.18);
            `}
    &:hover {
        border-color: ${({theme}) => theme.colors.accent};
        background: rgba(112, 189, 23, 0.08);
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
        box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.35);
    }

    &:focus-visible {
        outline: 2px solid rgba(112, 189, 23, 0.6);
        outline-offset: 2px;
    }
`;

const QueueDot = styled.span<{ $queued: boolean }>`
  position: relative;
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: ${({ theme, $queued }) => ($queued ? theme.colors.accent : 'transparent')};
  border: 1px solid ${({ theme, $queued }) => ($queued ? theme.colors.accent : theme.colors.border)};

  &::after {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 999px;
    border: 1px solid rgba(112, 189, 23, 0.4);
    opacity: ${({ $queued }) => ($queued ? 1 : 0)};
    animation: ${({ $queued }) => ($queued ? queueGlow : 'none')} 1.4s ease-out infinite;
  }
`;

type FloorListProps = {
  floors: number[];
  queuedFloors: Set<number>;
  activeFloor: number | null;
  onCall: (floor: number) => void;
  renderLabel: (floor: number) => string;
};

export const FloorList = ({
  floors,
  queuedFloors,
  activeFloor,
  onCall,
  renderLabel
}: FloorListProps) => {
  return (
    <Floors>
      {floors.map((floor) => (
        <FloorRow
          key={floor}
          type="button"
          $active={activeFloor === floor}
          $queued={queuedFloors.has(floor)}
          onClick={() => onCall(floor)}
          title={renderLabel(floor)}
        >
          <span>{renderLabel(floor)}</span>
          <QueueDot $queued={queuedFloors.has(floor)} />
        </FloorRow>
      ))}
    </Floors>
  );
};
