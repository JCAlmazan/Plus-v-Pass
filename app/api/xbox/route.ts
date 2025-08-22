import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Endpoints configuration
    const endpoints = {
      pcGames: "609d944c-d395-4c0a-9ea4-e9f39b52c1ad", // PC Games catalog
      consoleGames: "f6f1f99f-9b49-4ccd-b3bf-4d9767a77f5e", // Console Games
      eaGames: "b8900d09-a491-44cc-916e-32b5acae621b", // EA Games
    };

    const gamesByCategory = {
      pcGames: [], // PC Games only
      consoleGames: [], // Console + EA Games merged
    };

    // Fetch PC Games (this is working perfectly at 425)
    try {
      const pcEndpoint = `https://catalog.gamepass.com/sigls/v2?id=${endpoints.pcGames}&language=en-us&market=US`;
      const response = await fetch(pcEndpoint, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept: "application/json",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          gamesByCategory.pcGames = data.map((item) => item.id).filter(Boolean);
        }
      }
    } catch (error) {
      console.error("Error fetching PC games:", error);
    }

    // Fetch Console Games + EA Games (restore EXACT working logic)
    const consoleGameIds = new Set();

    // Console Games
    try {
      const consoleEndpoint = `https://catalog.gamepass.com/sigls/v2?id=${endpoints.consoleGames}&language=en-us&market=US`;
      const response = await fetch(consoleEndpoint, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept: "application/json",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          data.forEach((item) => {
            if (item.id) consoleGameIds.add(item.id);
          });
        }
      }
    } catch (error) {
      console.error("Error fetching console games:", error);
    }

    // EA Games
    try {
      const eaEndpoint = `https://catalog.gamepass.com/sigls/v2?id=${endpoints.eaGames}&language=en-us&market=US`;
      const response = await fetch(eaEndpoint, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept: "application/json",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          data.forEach((item) => {
            if (item.id) consoleGameIds.add(item.id);
          });
        }
      }
    } catch (error) {
      console.error("Error fetching EA games:", error);
    }

    gamesByCategory.consoleGames = Array.from(consoleGameIds);

    // Combine all unique game IDs for fetching details
    const allGameIds = new Set([
      ...gamesByCategory.pcGames,
      ...gamesByCategory.consoleGames,
    ]);

    if (allGameIds.size === 0) {
      throw new Error("No Xbox Game Pass games found from any catalog");
    }

    // Fetch game details from Microsoft Store in batches
    const allGames = [];
    const gameIdsArray = Array.from(allGameIds);
    const batchSize = 20;

    for (let i = 0; i < gameIdsArray.length; i += batchSize) {
      const batch = gameIdsArray.slice(i, i + batchSize);
      const bigIds = batch.join(",");

      try {
        const detailsResponse = await fetch(
          `https://displaycatalog.mp.microsoft.com/v7.0/products?bigIds=${bigIds}&market=US&languages=en-us`,
          {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
              Accept: "application/json",
            },
          }
        );

        if (detailsResponse.ok) {
          const detailsData = await detailsResponse.json();
          if (detailsData.Products) {
            allGames.push(...detailsData.Products);
          }
        }
      } catch (error) {
        continue;
      }
    }

    // Transform and categorize the games - NO CONFLICTS BETWEEN PC AND CONSOLE
    const categorizedGames = {
      pcGames: [],
      consoleGames: [],
    };

    allGames.forEach((game) => {
      const localizedProps = game.LocalizedProperties?.[0];
      const images = localizedProps?.Images || [];
      const boxArt = images.find(
        (img) =>
          img.ImagePurpose === "BoxArt" ||
          img.ImagePurpose === "Poster" ||
          img.ImagePurpose === "FeaturePromotionalSquareArt"
      );

      const title = localizedProps?.ProductTitle;
      const gameId = game.ProductId;

      if (title && title !== "Unknown Title") {
        const gameData = {
          title: title,
          image:
            boxArt?.Uri ||
            `/placeholder.svg?height=300&width=200&query=${encodeURIComponent(
              title
            )}`,
          description: localizedProps?.ProductDescription || "",
          id: gameId,
        };

        // Add to PC games if it's in PC catalog
        if (gamesByCategory.pcGames.includes(gameId)) {
          categorizedGames.pcGames.push(gameData);
        }

        // Add to console games if it's in console catalog (independent of PC)
        if (gamesByCategory.consoleGames.includes(gameId)) {
          categorizedGames.consoleGames.push(gameData);
        }
      }
    });

    return NextResponse.json({
      games: categorizedGames.consoleGames,
      pcGames: categorizedGames.pcGames,
      consoleGames: categorizedGames.consoleGames,
      debug: {
        totalGames: allGames.length,
        pcGamesCount: categorizedGames.pcGames.length,
        consoleGamesCount: categorizedGames.consoleGames.length,
        rawCounts: {
          pcGamesRaw: gamesByCategory.pcGames.length,
          consoleGamesRaw: gamesByCategory.consoleGames.length,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching Xbox games:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch Xbox games",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
