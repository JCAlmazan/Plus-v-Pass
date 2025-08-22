import { NextResponse } from "next/server";

export async function GET() {
  try {
    const endpoints = {
      plusGames:
        "https://www.playstation.com/bin/imagic/gameslist?locale=es-ar&categoryList=plus-games-list",
      ubisoftClassics:
        "https://www.playstation.com/bin/imagic/gameslist?locale=es-ar&categoryList=ubisoft-classics-list",
      plusClassics:
        "https://www.playstation.com/bin/imagic/gameslist?locale=es-ar&categoryList=plus-classics-list",
      monthlyGames:
        "https://www.playstation.com/bin/imagic/gameslist?locale=es-ar&categoryList=plus-monthly-games-list",
    };

    const headers = {
      accept: "*/*",
      "accept-language": "es-AR,es;q=0.9,en;q=0.8",
      "cache-control": "no-cache",
      pragma: "no-cache",
      priority: "u=1, i",
      referer: "https://www.playstation.com/es-ar/ps-plus/games/",
      "sec-ch-ua":
        '"Not)A;Brand";v="8", "Chromium";v="138", "Google Chrome";v="138"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
      cookie:
        "country=AR; AKA_A2=A; ak_bmsc=C109FBC8DF50CF7EBC90FBC84C01D0EB~000000000000000000000000000000~YAAQp8HOFxmKcGCYAQAAolXRbRxfU4GZjMW6Hfh4ymxVmHBdHcBRV3pSY+FjOuRzetQpcfUSqRr/E50TRZgs2xVjnOHnEFd27yQvPlkBnj4lD0aYmKj5/MrYt05pYsn4CwvZA+ANG508IZRGcN/n1PGxUgO7BjosyoUmMJtMr8Aq1bM8KFryHT5aMh/e21MOZiZ1ijJ/kjVCqWC7SRCwEJj3oOCY5moPUHsftPjUFKrKk6o5kC5198L0WT3Qa3XQbLw9jCtp2N4bqOHJQimdW3rJyNiYFAT2kPZ6yrPzCQ/3zThFQESccaJtrI60mjdUPX1miX1egAJ0FSWMKctOrGBDJp7QyZwa3f4+hTlOuJxRMCUe5r3D7L0XN8nBYRfoCwnAW3C7777hNUZMFg2kU3h3Yabn; bm_ss=ab8e18ef4e; bm_sz=15D9816153A4EDF4D9695E52B2237919~YAAQng/EFzAU5VSYAQAAG8PYbRzYEOaKsYIcSV9oueMURrS9VIyrO/0wIn45DpxEX2lziYmtCJMQpDgB5+mYUbq7fKdWqSHWTnE7LIn19tZ9Tgze39JpU1XFSTz3faTB4rBIUkNB1Cdh+q+nQDsG6mszmHiLd/y5A0XRRcVxV/xgcsq4y3bOh9NDQbirjKfcbSRhPglC2xVWR3JNcP3FNif4u95EJtTbWz3ivlRfBWZLZ+1yPrOpBuSbTa/Pq78gx/n3uU6qTOOHPPvUtWOkyflpzoDlWNn0FZc8wod1sficD+vbTVQQFQRVY3w8VYlXafK6rfiQ0cqg5iO+4xcvnxyWQv3+LWpxsNdPcWR8+7567hCtmLL69XCPCXxPSxGPFMfqkDM1njflflyp8lzf6jbFJWJ43kYnWxppphzn86D2v28ImgI9FQYjSJgeK+VPHobF~4274229~4403509; AMCVS_BD260C0F53C9733E0A490D45%40AdobeOrg=1; AMCV_BD260C0F53C9733E0A490D45%40AdobeOrg=179643557%7CMCIDTS%7C20304%7CMCMID%7C68601602749186818789212573195531938276%7CMCAID%7CNONE%7CMCOPTOUT-1754196810s%7CNONE%7CvVersion%7C5.5.0; bm_sv=CC0B6CE10836FD7E2269AD20A99B932B~YAAQTOocuHh63D6YAQAAvqkHbhwjZySeBsH7gsyn0eokgxCCoDeWIk2FykmiqxRJboKWufNQxj/QhlSAOKU6wmhhJYb3KmXOGCE8r2bjXKdSVr3UVHLrzEdGvIgGD3BAUyJey7Dw+UCrj30EhqvVIht0gG1qJaJA3mB09GLlbndT2K4/Uo5wEOgfVz9qeLSHRdr8nwJ31o+8PqoJtd2PjSVhyyt+MgusAmyifqbmBcgkycEBnmY9OYcR7VUOvqPgnqZmntov~1; bm_s=YAAQt/cSAvVg6FaYAQAAW6sHbgP7iJa7q44yJ7hN2kKYQyUzxWMGkEqnoPVnFHdVJ+eFuDSqksYrrEiD8ug0NZOqJdpXB7+adkqe6JkWBuak9Y5phbwLb0AIN0J8LB4pElizfPFBK6JABgTsNf45G+L7An/Jj/mG5zG8/G7ekNoGrnsaEbhjVcLm7wTrc6I6LzcqE+I0Mr1Q9kwMwInOXxcpknlOTv+AGC8pwfjjVBMDxKdSzz0fajX7bHW8hO86aIDV/uLsgARoK85+Rw1NsA6/AQgk8nbioA5vGcOIwPSY+KErxkXUhUOPcoYNb7dARwDHrIHI+z1uiN0F4tVwZ3xCJ3J/JHzyggjPlIVMmkjODWy9hfCIY7J1YrDl0yr/MzbRNUNIik/IHCG6siEGk1vCqusOJUyhSF6R5EWoAtOkjc2Diq5FWWGYEXmE4uLvQ536hmcIJx3oU39lSIoocZ3F6TS9tsrwkujejLf9YKqm3JeWtGgAqIjs2LcBUAO1rldaFEawHXCm8U0g6BQhXWCuXosP09QQY5r45mxC7OB4zWMn0sD/u6zVq4QwlLF83bg2CcJLq5m; bm_so=333DB3D409E8F6624B53D97BDF8CA7FE4307D76FFEBE35F8F1200F0C63EA6359~YAAQt/cSAvZg6FaYAQAAW6sHbgTiI6d5ccCPCbBsBtFrBRqP3kaBJ5b4EL6vAMrf8A+sfFIHanZiMvsWtICYy7x3NgNfqERL1kSYXxiwo6rNlUrXeYVu5Sq54ylkq6OhUKBk7zGZeQ9vknPz+MGERyR4r/Vk5shA94UaNxQGc9JlA742COc8amQileyN1MyqUF1I5aU2IDwewRo6SZNvWHjFv4qQ0CSGBR9rvsmir6kVVL5O/y+w+2JDDIbFeYaOCNxeA6yFT41wXQ6pd+BpI75lwcd076XsejfgbgQq6XzLfcuHuqUjcrXSQqxpjBnoSSDSkk60pTrFJpZNtmePObC6ud177U/9DS2dsNadGWI/jp0/yaM6LwQW9sif4jemJIQGhpTgVyg4bLPm6/bMW+g4jlbw9s7gzlVRcXU/oFstYyB/9hhaYujg2xGMHYeDZYE7ZLZ7Xw5HM6a/fksM7NIP; _abck=69705658696307A3EF6B04790B50E57D~-1~YAAQt/cSAvdg6FaYAQAAcqsHbg7cVm4N1H6JMIVHgWQxdxHtkE8tyB6rnCok0r1vdlF/zezabPV6HRlKRYezNhjbCyR/swIOxQkCVeduBaVRQ+t97R8fJv0nbimkz+efhgvCf+KzBrEjy2Oyk9to7xLMsyzNOLELX3BFJJzJeTf+H5P+lLMD1PlBKHvPbS6vtylm/mdYmpGX6hqphMhZCiO4rOlNanowpEksSlkcKP9JlOiJD/x+1YIfqeba1Kl0sKLDAC+T9rK4THSVpKtJJUJxHLAgIvWcxKvaCeCYUQLAkJc1mKO4D/3Fyd0jlq/M9/2oF5bQy3Mscea6RZAPky8dlqNrBF9iwf3G6INr3LIgTQ2a82bOJAmZK6qf3CfPKxHgWveJgQJNE0SbYxVigmCUUrAgO46f3nBWbbraUIipt4/FD133mrLDT92wYrQNDST17eGtpkB7VfXy6SWAUZnTapuhP2LcgQEr7UXi4nddb14zDl7NyRHVWHjLBSV2gYY9Z7W/yOQ4LMdjG/4qy64y2DKzWWTmbbFYd3UbNi48RNTAsXqHzFQKb4rj5ns7Jg/vMrlfOn4iTejgLnKCfsgaDJB5KQ7ihDzRIFqMqemuhyRFzl8d5sR9eQtJGbc+FMpBOI/2FMPNhn5MenPwOic5c8naKB57BxmrbCPioLkOX2QT+Z+ijmJb+UJKMUQT4ieDgcPXj1rLBq/B5oa6d/vhNd1Ud1pDW/LgH000~-1~-1~-1",
    };

    const gamesByCategory = {
      plusGames: [],
      ubisoftClassics: [],
      plusClassics: [],
      monthlyGames: [],
      all: [],
    };

    for (const [category, endpoint] of Object.entries(endpoints)) {
      try {
        const response = await fetch(endpoint, {
          method: "GET",
          headers,
        });

        if (response.ok) {
          const text = await response.text();
          try {
            const data = JSON.parse(text);
            if (Array.isArray(data)) {
              const categoryGames = [];
              data.forEach((catalog) => {
                if (catalog.games && Array.isArray(catalog.games)) {
                  categoryGames.push(...catalog.games);
                }
              });
              gamesByCategory[category] = categoryGames.filter(
                (game) => game.name
              );
            }
          } catch (parseError) {
            continue;
          }
        }
      } catch (error) {
        continue;
      }
    }

    // Create merged "all" category with unique games
    const allGames = [];
    const seenNames = new Set();

    Object.values(gamesByCategory).forEach((categoryGames) => {
      if (Array.isArray(categoryGames)) {
        categoryGames.forEach((game) => {
          if (game.name && !seenNames.has(game.name)) {
            seenNames.add(game.name);
            allGames.push(game);
          }
        });
      }
    });

    gamesByCategory.all = allGames;

    return NextResponse.json({
      games: gamesByCategory.all, // Default for backward compatibility
      plusGames: gamesByCategory.plusGames,
      ubisoftClassics: gamesByCategory.ubisoftClassics,
      plusClassics: gamesByCategory.plusClassics,
      monthlyGames: gamesByCategory.monthlyGames,
      allGames: gamesByCategory.all,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch PlayStation games",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
