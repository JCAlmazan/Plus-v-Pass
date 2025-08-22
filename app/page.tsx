"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Grid, List, X, Monitor, Gamepad2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ScrollToTop } from "@/components/scroll-to-top";
import { FilterModal } from "@/components/filter-modal";
import Image from "next/image";

interface Game {
  title: string;
  name?: string;
  image?: string;
  imageUrl?: string;
  description?: string;
  id?: string;
}

interface GameComparison {
  title: string;
  playstation: Game | null;
  xbox: Game | null;
}

type XboxFilter = "console" | "pc";
type PlayStationFilterType =
  | "plus-games"
  | "ubisoft-classics"
  | "plus-classics"
  | "monthly-games";

export default function GameComparison() {
  const [playstationGames, setPlaystationGames] = useState<Game[]>([]);
  const [playstationCategories, setPlaystationCategories] = useState({
    all: [],
    plusGames: [],
    ubisoftClassics: [],
    plusClassics: [],
    monthlyGames: [],
  });
  const [pcGames, setPcGames] = useState<Game[]>([]);
  const [consoleGames, setConsoleGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [xboxFilter, setXboxFilter] = useState<XboxFilter>("console");
  const [playstationFilters, setPlaystationFilters] = useState<
    Set<PlayStationFilterType>
  >(new Set());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    setLoading(true);
    setError(null);

    try {
      const [psResponse, xboxResponse] = await Promise.all([
        fetch("/api/playstation"),
        fetch("/api/xbox"),
      ]);

      const psData = await psResponse.json();
      const xboxData = await xboxResponse.json();

      console.log("PlayStation API Response:", psData);
      console.log("Xbox API Response:", xboxData);

      if (psData.allGames) {
        setPlaystationGames(psData.allGames);
        setPlaystationCategories({
          all: psData.allGames,
          plusGames: psData.plusGames || [],
          ubisoftClassics: psData.ubisoftClassics || [],
          plusClassics: psData.plusClassics || [],
          monthlyGames: psData.monthlyGames || [],
        });
      } else {
        console.error("No PlayStation games found:", psData);
      }

      if (xboxData.pcGames && xboxData.consoleGames) {
        setPcGames(xboxData.pcGames);
        setConsoleGames(xboxData.consoleGames);
      } else {
        console.error("No Xbox games found:", xboxData);
      }
    } catch (err) {
      setError("Failed to fetch games. Please try again.");
      console.error("Error fetching games:", err);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredXboxGames = (): Game[] => {
    switch (xboxFilter) {
      case "pc":
        return pcGames;
      default:
        return consoleGames;
    }
  };

  const getFilteredPlayStationGames = (): Game[] => {
    // If no filters selected, show all games
    if (playstationFilters.size === 0) {
      return playstationCategories.all;
    }

    // Combine games from selected filters
    const combinedGames = new Map<string, Game>();

    playstationFilters.forEach((filter) => {
      let categoryGames: Game[] = [];

      switch (filter) {
        case "plus-games":
          categoryGames = playstationCategories.plusGames;
          break;
        case "ubisoft-classics":
          categoryGames = playstationCategories.ubisoftClassics;
          break;
        case "plus-classics":
          categoryGames = playstationCategories.plusClassics;
          break;
        case "monthly-games":
          categoryGames = playstationCategories.monthlyGames;
          break;
      }

      // Add games to combined set (using name as key to avoid duplicates)
      categoryGames.forEach((game) => {
        if (game.name) {
          combinedGames.set(game.name, game);
        }
      });
    });

    return Array.from(combinedGames.values());
  };

  const handlePlayStationFilterToggle = (
    filter: PlayStationFilterType | "all"
  ) => {
    if (filter === "all") {
      // Clear all filters to show all games
      setPlaystationFilters(new Set());
    } else {
      setPlaystationFilters((prev) => {
        const newFilters = new Set(prev);
        if (newFilters.has(filter)) {
          // Remove filter if already selected
          newFilters.delete(filter);
        } else {
          // Add filter if not selected
          newFilters.add(filter);
        }
        return newFilters;
      });
    }
  };

  const handleXboxFilterToggle = (filter: XboxFilter) => {
    setXboxFilter(filter);
  };

  const createComparison = (): GameComparison[] => {
    // Filter out games without titles and create safe title sets
    const filteredPsGames = getFilteredPlayStationGames();
    const validPsGames = filteredPsGames.filter(
      (g) => g.name && typeof g.name === "string"
    );
    const filteredXboxGames = getFilteredXboxGames();
    const validXboxGames = filteredXboxGames.filter(
      (g) => g.title && typeof g.title === "string"
    );

    // Normalize titles for better matching
    const normalizeTitle = (title: string) => {
      return (
        title
          .toLowerCase()
          // Remove platform indicators and editions
          .replace(
            /\b(ps4|ps5|playstation\s*[®™]?\s*[45]?|xbox\s*(series\s*[xs][|/]?[sx]?|one|360)?)\b/gi,
            ""
          )
          // Remove edition types
          .replace(
            /\b(edition|version|remaster|remastered|definitive|ultimate|deluxe|premium|gold|standard|complete|goty|game\s*of\s*the\s*year)\b/gi,
            ""
          )
          // Remove platform store indicators
          .replace(
            /\b(windows|pc|steam|epic\s*games?|microsoft\s*store|win)\b/gi,
            ""
          )
          // Remove special characters and symbols
          .replace(/[^\w\s]/g, "")
          // Replace multiple spaces with single space
          .replace(/\s+/g, " ")
          // Remove common suffixes/prefixes
          .replace(/\b(the|a|an)\s+/gi, "")
          .replace(/\s+(the|a|an)\b/gi, "")
          .trim()
      );
    };

    const allTitles = new Set([
      ...validPsGames.map((g) => normalizeTitle(g.name || "")),
      ...validXboxGames.map((g) => normalizeTitle(g.title)),
    ]);

    return Array.from(allTitles)
      .map((normalizedTitle) => {
        const psGame = validPsGames.find(
          (g) => normalizeTitle(g.name || "") === normalizedTitle
        );
        const xboxGame = validXboxGames.find(
          (g) => normalizeTitle(g.title || "") === normalizedTitle
        );

        return {
          title: psGame?.name || xboxGame?.title || "",
          playstation: psGame || null,
          xbox: xboxGame || null,
        };
      })
      .filter((item) => item.title) // Remove any items without titles
      .sort((a, b) => {
        return sortOrder === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      });
  };

  const comparison = createComparison();
  const filteredXboxGames = getFilteredXboxGames();
  const filteredPsGames = getFilteredPlayStationGames();

  const getFilterLabel = (filter: XboxFilter) => {
    switch (filter) {
      case "pc":
        return "PC Games";
      default:
        return "Console Games";
    }
  };

  const getPlayStationFilterLabel = () => {
    if (playstationFilters.size === 0) {
      return "All Games";
    }

    const filterNames = Array.from(playstationFilters).map((filter) => {
      switch (filter) {
        case "plus-games":
          return "Plus Games";
        case "ubisoft-classics":
          return "Ubisoft";
        case "plus-classics":
          return "Classics";
        case "monthly-games":
          return "Monthly";
        default:
          return "";
      }
    });

    return filterNames.join(" + ");
  };

  // Prepare filter data for modals
  const playstationFilterData = [
    {
      key: "all",
      label: "All",
      count: playstationCategories.all.length,
      active: playstationFilters.size === 0,
    },
    {
      key: "plus-games",
      label: "Plus Games",
      count: playstationCategories.plusGames.length,
      active: playstationFilters.has("plus-games"),
    },
    {
      key: "ubisoft-classics",
      label: "Ubisoft",
      count: playstationCategories.ubisoftClassics.length,
      active: playstationFilters.has("ubisoft-classics"),
    },
    {
      key: "plus-classics",
      label: "Classics",
      count: playstationCategories.plusClassics.length,
      active: playstationFilters.has("plus-classics"),
    },
    {
      key: "monthly-games",
      label: "Monthly",
      count: playstationCategories.monthlyGames.length,
      active: playstationFilters.has("monthly-games"),
    },
  ];

  const xboxFilterData = [
    {
      key: "console",
      label: "Console",
      count: consoleGames.length,
      active: xboxFilter === "console",
    },
    {
      key: "pc",
      label: "PC",
      count: pcGames.length,
      active: xboxFilter === "pc",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <ThemeToggle />
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-lg text-foreground">Loading game libraries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <ThemeToggle />
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">{error}</p>
          <Button onClick={fetchGames}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ThemeToggle />
      <ScrollToTop />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Game Library Comparison
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Compare PlayStation Plus vs Xbox Game Pass libraries
          </p>

          {/* View Toggle */}
          <div className="flex justify-center gap-2 mb-6">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              onClick={() => setViewMode("grid")}
              className="flex items-center gap-2"
            >
              <Grid className="h-4 w-4" />
              Grid View
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              onClick={() => setViewMode("list")}
              className="flex items-center gap-2"
            >
              <List className="h-4 w-4" />
              List View
            </Button>
            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="flex items-center gap-2"
            >
              {sortOrder === "asc" ? "A-Z" : "Z-A"}
            </Button>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#00439c]">
                {
                  filteredPsGames.filter(
                    (g) => g.name && typeof g.name === "string"
                  ).length
                }
              </div>
              <div className="text-sm text-muted-foreground">
                PlayStation Plus ({getPlayStationFilterLabel()})
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#107c10]">
                {
                  filteredXboxGames.filter(
                    (g) => g.title && typeof g.title === "string"
                  ).length
                }
              </div>
              <div className="text-sm text-muted-foreground">
                Xbox Game Pass ({getFilterLabel(xboxFilter)})
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {comparison.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Unique</div>
            </div>
          </div>
        </div>

        {/* Platform Headers with Filters */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center space-y-3">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-[#00439c]/10 dark:bg-[#00439c]/20 blur-xl rounded-lg"></div>
              <Badge
                variant="secondary"
                className="relative bg-[#00439c]/20 text-[#00439c] dark:text-[#4a90e2] text-lg px-4 py-2 border-[#00439c]/30"
              >
                PlayStation Plus
              </Badge>
              <FilterModal
                title="PlayStation Plus"
                color="#00439c"
                filters={playstationFilterData}
                onFilterToggle={handlePlayStationFilterToggle}
                multiSelect={true}
              />
            </div>

            {/* PlayStation Filter Buttons - Hidden on mobile */}
            <div className="hidden md:flex justify-center gap-1 flex-wrap">
              <Button
                size="sm"
                variant={playstationFilters.size === 0 ? "default" : "outline"}
                onClick={() => handlePlayStationFilterToggle("all")}
                className={`text-xs ${
                  playstationFilters.size === 0
                    ? "bg-[#00439c] hover:bg-[#00439c]/90 text-white"
                    : "hover:bg-[#00439c]/10 hover:text-[#00439c] hover:border-[#00439c]/30"
                }`}
              >
                All ({playstationCategories.all.length})
              </Button>
              <Button
                size="sm"
                variant={
                  playstationFilters.has("plus-games") ? "default" : "outline"
                }
                onClick={() => handlePlayStationFilterToggle("plus-games")}
                className={`text-xs ${
                  playstationFilters.has("plus-games")
                    ? "bg-[#00439c] hover:bg-[#00439c]/90 text-white"
                    : "hover:bg-[#00439c]/10 hover:text-[#00439c] hover:border-[#00439c]/30"
                }`}
              >
                Plus Games ({playstationCategories.plusGames.length})
              </Button>
              <Button
                size="sm"
                variant={
                  playstationFilters.has("ubisoft-classics")
                    ? "default"
                    : "outline"
                }
                onClick={() =>
                  handlePlayStationFilterToggle("ubisoft-classics")
                }
                className={`text-xs ${
                  playstationFilters.has("ubisoft-classics")
                    ? "bg-[#00439c] hover:bg-[#00439c]/90 text-white"
                    : "hover:bg-[#00439c]/10 hover:text-[#00439c] hover:border-[#00439c]/30"
                }`}
              >
                Ubisoft ({playstationCategories.ubisoftClassics.length})
              </Button>
              <Button
                size="sm"
                variant={
                  playstationFilters.has("plus-classics")
                    ? "default"
                    : "outline"
                }
                onClick={() => handlePlayStationFilterToggle("plus-classics")}
                className={`text-xs ${
                  playstationFilters.has("plus-classics")
                    ? "bg-[#00439c] hover:bg-[#00439c]/90 text-white"
                    : "hover:bg-[#00439c]/10 hover:text-[#00439c] hover:border-[#00439c]/30"
                }`}
              >
                Classics ({playstationCategories.plusClassics.length})
              </Button>
              <Button
                size="sm"
                variant={
                  playstationFilters.has("monthly-games")
                    ? "default"
                    : "outline"
                }
                onClick={() => handlePlayStationFilterToggle("monthly-games")}
                className={`text-xs ${
                  playstationFilters.has("monthly-games")
                    ? "bg-[#00439c] hover:bg-[#00439c]/90 text-white"
                    : "hover:bg-[#00439c]/10 hover:text-[#00439c] hover:border-[#00439c]/30"
                }`}
              >
                Monthly ({playstationCategories.monthlyGames.length})
              </Button>
            </div>
          </div>
          <div className="text-center space-y-3">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-[#107c10]/10 dark:bg-[#107c10]/20 blur-xl rounded-lg"></div>
              <Badge
                variant="secondary"
                className="relative bg-[#107c10]/20 text-[#107c10] dark:text-[#4ade80] text-lg px-4 py-2 border-[#107c10]/30"
              >
                Xbox Game Pass
              </Badge>
              <FilterModal
                title="Xbox Game Pass"
                color="#107c10"
                filters={xboxFilterData}
                onFilterToggle={handleXboxFilterToggle}
                multiSelect={false}
              />
            </div>

            {/* Xbox Filter Buttons - Hidden on mobile */}
            <div className="hidden md:flex justify-center gap-2">
              <Button
                size="sm"
                variant={xboxFilter === "console" ? "default" : "outline"}
                onClick={() => setXboxFilter("console")}
                className={`flex items-center gap-1 text-xs ${
                  xboxFilter === "console"
                    ? "bg-[#107c10] hover:bg-[#107c10]/90 text-white"
                    : "hover:bg-[#107c10]/10 hover:text-[#107c10] hover:border-[#107c10]/30"
                }`}
              >
                <Gamepad2 className="h-3 w-3" />
                Console ({consoleGames.length})
              </Button>
              <Button
                size="sm"
                variant={xboxFilter === "pc" ? "default" : "outline"}
                onClick={() => setXboxFilter("pc")}
                className={`flex items-center gap-1 text-xs ${
                  xboxFilter === "pc"
                    ? "bg-[#107c10] hover:bg-[#107c10]/90 text-white"
                    : "hover:bg-[#107c10]/10 hover:text-[#107c10] hover:border-[#107c10]/30"
                }`}
              >
                <Monitor className="h-3 w-3" />
                PC ({pcGames.length})
              </Button>
            </div>
          </div>
        </div>

        {/* Games Comparison */}
        <div className="space-y-4">
          {comparison.map((item, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-0">
                {viewMode === "list" ? (
                  <div className="grid grid-cols-2 min-h-[80px]">
                    {/* PlayStation Side - Text first, then image, both right-aligned */}
                    <div className="border-r border-border flex items-center justify-end p-4">
                      {item.playstation ? (
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <h3 className="font-semibold text-foreground line-clamp-2">
                              {item.playstation.name}
                            </h3>
                          </div>
                          {item.playstation.imageUrl && (
                            <Image
                              src={
                                item.playstation.imageUrl || "/placeholder.svg"
                              }
                              alt={item.playstation.name}
                              width={60}
                              height={60}
                              className="rounded object-cover flex-shrink-0"
                            />
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center text-red-500">
                          <span className="mr-2 text-muted-foreground">
                            Not Available
                          </span>
                          <X className="h-8 w-8" />
                        </div>
                      )}
                    </div>

                    {/* Xbox Side - Image first, then text, both left-aligned */}
                    <div className="flex items-center justify-start p-4">
                      {item.xbox ? (
                        <div className="flex items-center gap-3">
                          {item.xbox.image && (
                            <Image
                              src={item.xbox.image || "/placeholder.svg"}
                              alt={item.xbox.title}
                              width={60}
                              height={60}
                              className="rounded object-cover flex-shrink-0"
                            />
                          )}
                          <div className="text-left">
                            <h3 className="font-semibold text-foreground line-clamp-2">
                              {item.xbox.title}
                            </h3>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-500">
                          <X className="h-8 w-8" />
                          <span className="ml-2 text-muted-foreground">
                            Not Available
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 min-h-[300px]">
                    {/* PlayStation Side */}
                    <div className="p-6 border-r border-border flex flex-col items-center justify-center">
                      {item.playstation ? (
                        <div className="text-center">
                          <Image
                            src={
                              item.playstation.imageUrl ||
                              "/placeholder.svg?height=200&width=150&query=game+cover"
                            }
                            alt={item.playstation.name}
                            width={150}
                            height={200}
                            className="rounded-lg object-cover mx-auto mb-4 shadow-lg"
                          />
                          <h3 className="font-semibold text-foreground text-center">
                            {item.playstation.name}
                          </h3>
                        </div>
                      ) : (
                        <div className="text-center text-red-500">
                          <X className="h-16 w-16 mx-auto mb-4" />
                          <span className="text-muted-foreground">
                            Not Available
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Xbox Side */}
                    <div className="p-6 flex flex-col items-center justify-center">
                      {item.xbox ? (
                        <div className="text-center">
                          <Image
                            src={
                              item.xbox.image ||
                              "/placeholder.svg?height=200&width=150&query=game+cover"
                            }
                            alt={item.xbox.title}
                            width={150}
                            height={200}
                            className="rounded-lg object-cover mx-auto mb-4 shadow-lg"
                          />
                          <h3 className="font-semibold text-foreground text-center">
                            {item.xbox.title}
                          </h3>
                        </div>
                      ) : (
                        <div className="text-center text-red-500">
                          <X className="h-16 w-16 mx-auto mb-4" />
                          <span className="text-muted-foreground">
                            Not Available
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-muted-foreground">
          <p>
            Data refreshed automatically. Last updated:{" "}
            {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
