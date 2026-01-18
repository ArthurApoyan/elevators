import styled from 'styled-components';

const Floors = styled.div`
  display: grid;
  gap: 6px;
`;

const FloorRow = styled.button<{ $active: boolean }>`
  align-items: center;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm}px;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  padding: 6px 10px;
  text-align: left;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  ${({ $active, theme }) =>
    $active
      ? `border-color: ${theme.colors.accent}; box-shadow: 0 0 0 2px rgba(246, 196, 83, 0.2);`
      : ''}
`;

const QueueDot = styled.span<{ $queued: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: ${({ theme, $queued }) => ($queued ? theme.colors.accent : 'transparent')};
  border: 1px solid ${({ theme, $queued }) => ($queued ? theme.colors.accent : theme.colors.border)};
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
          onClick={() => onCall(floor)}
        >
          <span>{renderLabel(floor)}</span>
          <QueueDot $queued={queuedFloors.has(floor)} />
        </FloorRow>
      ))}
    </Floors>
  );
};
