import { List, showToast, Toast, ActionPanel, Action, Icon } from "@raycast/api";
import { useState, useMemo } from "react";
import { Color, basicColors, extendedColors } from "./constants";
import { ColorListItem } from "./components/ColorListItem";
import Fuse from "fuse.js";

type ColorFilter = "all" | "basic" | "extended";

// Configure Fuse options for fuzzy search
const fuseOptions = {
  keys: [
    { name: "name", weight: 2 }, // Give more weight to name matches
    { name: "hex", weight: 1 },
    { name: "rgb", weight: 1 }
  ],
  threshold: 0.5, // Lower threshold = more strict matching
  distance: 150, // How far to search for matches
  includeScore: true,
  shouldSort: true,
  minMatchCharLength: 2 // Require at least 2 characters to match
};

export default function Command() {
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

  // Initialize Fuse instance with the current color set
  const fuse = useMemo(() => new Fuse(colors, fuseOptions), [colors]);

  const filteredColors = useMemo(() => {
    if (!searchText) return colors;
    
    // Use Fuse.js for fuzzy search
    const results = fuse.search(searchText);
    
    // Filter out low-quality matches and sort by score
    return results
      .filter(result => result.score && result.score < 0.4) // Only keep good matches
      .sort((a, b) => (a.score || 0) - (b.score || 0)) // Explicit sort by score
      .map(result => result.item);
  }, [colors, searchText, fuse]);

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
      searchBarPlaceholder="Search colors by name, hex, or RGB... (typos allowed)"
      isShowingDetail={false}
      searchBarAccessory={
        <List.Dropdown
          tooltip="Color Set"
          value={colorFilter}
          onChange={(value) => setColorFilter(value as ColorFilter)}
        >
          <List.Dropdown.Item title="All Colors" value="all" icon={Icon.StackedBars3} />
          <List.Dropdown.Item title="Basic Colors" value="basic" icon={Icon.Circle} />
          <List.Dropdown.Item title="Extended Colors" value="extended" icon={Icon.CircleEllipsis} />
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
