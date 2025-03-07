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
  isDetailVisible: boolean;
  onToggleDetail: () => void;
}

export function ColorListItem({ color, onSelect, showHex, onToggleFormat, isDetailVisible, onToggleDetail }: ColorListItemProps) {
  const getCategoryIcons = (categories: Color["category"][]) => {
    // Sort categories to ensure consistent order (basic first, then extended)
    const sortedCategories = [...categories].sort((a, b) => a === "basic" ? -1 : 1);
    return sortedCategories.map((category) => ({
      icon: category === "basic" ? Icon.Circle : Icon.CircleEllipsis,
      tooltip: `${category.charAt(0).toUpperCase()}${category.slice(1)} Color`
    }));
  };

  // Generate SVG for the color preview
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="200" height="150" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="150" fill="${color.hex}" rx="8" ry="8"/>
  <rect width="200" height="150" fill="none" stroke="#ccc" stroke-width="1" rx="8" ry="8"/>
</svg>`;

  // Convert SVG to base64 and create data URI
  const base64Svg = Buffer.from(svg).toString('base64');
  const colorImageMarkdown = `![Color Preview](data:image/svg+xml;base64,${base64Svg})`;

  return (
    <List.Item
      title={color.name}
      subtitle={showHex ? color.hex : color.rgb}
      icon={{ source: Icon.CircleFilled, tintColor: color.hex }}
      accessories={getCategoryIcons(color.categories)}
      detail={
        isDetailVisible ? (
          <List.Item.Detail
            markdown={colorImageMarkdown}
            metadata={
              <List.Item.Detail.Metadata>
                <List.Item.Detail.Metadata.Separator />
                <List.Item.Detail.Metadata.Label
                  title="Categories"
                  text={color.categories.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)).join(", ")}
                  icon={color.categories.includes("basic") ? Icon.Circle : Icon.CircleEllipsis}
                />
                <List.Item.Detail.Metadata.Separator />
                <List.Item.Detail.Metadata.Label
                  title="Name"
                  text={color.name}
                />
                <List.Item.Detail.Metadata.Label
                  title="HEX"
                  text={color.hex}
                />
                <List.Item.Detail.Metadata.Label
                  title="RGB"
                  text={color.rgb}
                />
              </List.Item.Detail.Metadata>
            }
          />
        ) : undefined
      }
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
            <Action
              title={isDetailVisible ? "Hide Details" : "Show Details"}
              onAction={onToggleDetail}
              shortcut={{ modifiers: ["cmd"], key: "i" }}
            />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
} 