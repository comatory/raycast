import { List, showToast, Toast, ActionPanel, Action, Icon } from "@raycast/api";
import { useState, useMemo } from "react";
import { Color, basicColors, extendedColors } from "./constants";
import { ColorListItem } from "./components/ColorListItem";
import Fuse from "fuse.js";
import { Clipboard } from "@raycast/api";

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
  const [isDetailVisible, setIsDetailVisible] = useState(false);

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
    if (!searchText) return colors.map(color => ({
      ...color,
      categories: [color.category]
    }));
    
    // Use Fuse.js for fuzzy search
    const results = fuse.search(searchText);
    
    // Filter out low-quality matches and sort by score
    const matchedColors = results
      .filter(result => result.score && result.score < 0.4) // Only keep good matches
      .sort((a, b) => (a.score || 0) - (b.score || 0)) // Explicit sort by score
      .map(result => result.item);

    // Deduplicate colors by name while preserving category information
    const colorMap = new Map<string, { color: Color; categories: Set<Color["category"]> }>();
    
    matchedColors.forEach((color) => {
      const existing = colorMap.get(color.name);
      if (existing) {
        existing.categories.add(color.category);
      } else {
        colorMap.set(color.name, {
          color,
          categories: new Set([color.category])
        });
      }
    });

    // Convert back to array, combining category information
    return Array.from(colorMap.values()).map(({ color, categories }) => ({
      ...color,
      categories: Array.from(categories)
    }));
  }, [colors, searchText, fuse]);

  const handleColorSelect = async (color: Omit<Color, "category"> & { categories: Color["category"][] }) => {
    let textToCopy = "";
    switch (color.format) {
      case "rgb":
        textToCopy = color.rgb;
        break;
      case "name":
        textToCopy = color.id;
        break;
      default:
        textToCopy = color.hex;
    }

    await Clipboard.copy(textToCopy);
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
      searchBarPlaceholder="Name, hex, or RGB..."
      isShowingDetail={isDetailVisible}
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
          isDetailVisible={isDetailVisible}
          onToggleDetail={() => setIsDetailVisible(!isDetailVisible)}
        />
      ))}
    </List>
  );
}
