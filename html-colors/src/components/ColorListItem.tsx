import { List, ActionPanel, Action, Icon } from "@raycast/api";
import { Color } from "../constants";

type ColorWithCategories = Omit<Color, "category"> & {
  categories: Color["category"][];
};

interface ColorListItemProps {
  color: ColorWithCategories;
  onSelect: (color: ColorWithCategories) => void;
  showHex: boolean;
  onToggleFormat: () => void;
}

export function ColorListItem({ color, onSelect, showHex, onToggleFormat }: ColorListItemProps) {
  const getCategoryIcons = (categories: Color["category"][]) => {
    // Sort categories to ensure consistent order (basic first, then extended)
    const sortedCategories = [...categories].sort((a, b) => a === "basic" ? -1 : 1);
    return sortedCategories.map((category) => ({
      icon: category === "basic" ? Icon.Circle : Icon.CircleEllipsis,
      tooltip: `${category.charAt(0).toUpperCase()}${category.slice(1)} Color`
    }));
  };

  return (
    <List.Item
      title={color.name}
      subtitle={showHex ? color.hex : color.rgb}
      icon={{ source: Icon.CircleFilled, tintColor: color.hex }}
      accessories={getCategoryIcons(color.categories)}
      actions={
        <ActionPanel>
          <ActionPanel.Section>
            <Action
              title="Copy HEX"
              onAction={() => onSelect({ ...color, format: "hex" })}
            />
            <Action
              title="Copy RGB"
              onAction={() => onSelect({ ...color, format: "rgb" })}
            />
            <Action
              title="Copy Name"
              onAction={() => onSelect({ ...color, format: "name" })}
            />
          </ActionPanel.Section>
          <ActionPanel.Section>
            <Action
              title={`Show ${showHex ? "RGB" : "HEX"}`}
              onAction={onToggleFormat}
              shortcut={{ modifiers: ["cmd"], key: "t" }}
            />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
} 