import { List, showToast, Toast, ActionPanel, Action } from "@raycast/api";
import { useState, useMemo } from "react";
import { Color, basicColors, extendedColors } from "../constants";
import { ColorListItem } from "./ColorListItem";

type ColorFilter = "all" | "basic" | "extended";

export function ColorList() {
  const [searchText, setSearchText] = useState("");
  const [colorFilter, setColorFilter] = useState<ColorFilter>("all");
  const [showHex, setShowHex] = useState(true);

  const colors = useMemo(() => {
    switch (colorFilter) {
      case "basic":
        return basicColors;
      case "extended":
        return extendedColors;
      default:
        return [...basicColors, ...extendedColors];
    }
  }, [colorFilter]);

  const filteredColors = useMemo(() => {
    if (!searchText) return colors;
    
    const searchLower = searchText.toLowerCase();
    return colors.filter(
      (color) =>
        color.name.toLowerCase().includes(searchLower) ||
        color.hex.toLowerCase().includes(searchLower) ||
        color.rgb.toLowerCase().includes(searchLower)
    );
  }, [colors, searchText]);

  const handleColorSelect = async (color: Color) => {
    let textToCopy = "";
    switch (color.format) {
      case "rgb":
        textToCopy = color.rgb;
        break;
      case "name":
        textToCopy = color.name;
        break;
      default:
        textToCopy = color.hex;
    }

    await showToast({
      style: Toast.Style.Success,
      title: "Color copied to clipboard",
      message: textToCopy,
    });
  };

  return (
    <List
      searchText={searchText}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Search colors by name, hex, or RGB..."
      isShowingDetail={false}
      searchBarAccessory={
        <List.Dropdown
          tooltip="Color Set"
          value={colorFilter}
          onChange={(value) => setColorFilter(value as ColorFilter)}
        >
          <List.Dropdown.Item title="All Colors" value="all" />
          <List.Dropdown.Item title="Basic Colors" value="basic" />
          <List.Dropdown.Item title="Extended Colors" value="extended" />
        </List.Dropdown>
      }
    >
      {filteredColors.map((color) => (
        <ColorListItem
          key={`${color.category}-${color.name}-${color.hex}`}
          color={color}
          onSelect={handleColorSelect}
          showHex={showHex}
          onToggleFormat={() => setShowHex(!showHex)}
        />
      ))}
    </List>
  );
} 