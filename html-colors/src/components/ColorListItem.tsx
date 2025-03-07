import { List, ActionPanel, Action, Icon } from "@raycast/api";
import { Color } from "../constants";

interface ColorListItemProps {
  color: Color;
  onSelect: (color: Color) => void;
  showHex: boolean;
  onToggleFormat: () => void;
}

export function ColorListItem({ color, onSelect, showHex, onToggleFormat }: ColorListItemProps) {
  return (
    <List.Item
      title={color.name}
      subtitle={showHex ? color.hex : color.rgb}
      accessories={[
        {
          icon: {
            source: Icon.CircleFilled,
            tintColor: color.hex,
          },
          tooltip: "Color Preview",
        },
        {
          icon: {
            source: color.category === "Basic" ? Icon.Circle : Icon.CircleEllipsis,
          },
          tooltip: color.category,
        }
      ]}
      actions={
        <ActionPanel>
          <Action title="Copy HEX" onAction={() => onSelect(color)} />
          <Action title="Copy RGB" onAction={() => onSelect({ ...color, format: "rgb" })} />
          <Action title="Copy Name" onAction={() => onSelect({ ...color, format: "name" })} />
          <Action title={`Show ${showHex ? "RGB" : "HEX"}`} onAction={onToggleFormat} />
        </ActionPanel>
      }
    />
  );
} 