import { List, ActionPanel, Action } from "@raycast/api";
import { Color } from "../constants";

interface ColorListItemProps {
  color: Color;
  onSelect: (color: Color) => void;
  showHex: boolean;
  onToggleFormat: () => void;
}

export function ColorListItem({ color, onSelect, showHex, onToggleFormat }: ColorListItemProps) {
  const colorPreview = {
    source: {
      light: "color-preview-light.png",
      dark: "color-preview-dark.png",
    },
  };

  const categoryIcon = {
    source: {
      light: color.category === "Basic" ? "basic-icon-light.png" : "extended-icon-light.png",
      dark: color.category === "Basic" ? "basic-icon-dark.png" : "extended-icon-dark.png",
    },
  };

  return (
    <List.Item
      title={color.name}
      subtitle={showHex ? color.hex : color.rgb}
      accessories={[
        {
          icon: colorPreview,
          tooltip: "Color Preview",
        },
        {
          icon: categoryIcon,
          tooltip: color.category,
        },
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