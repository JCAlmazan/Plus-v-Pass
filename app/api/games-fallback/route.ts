import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Using RAWG API as fallback (free tier available)
    const rawgApiKey = "YOUR_RAWG_API_KEY" // You'd need to get this from rawg.io

    // This is a conceptual approach - RAWG doesn't specifically track subscription services
    // but we could search for popular games and manually curate lists

    const mockPlayStationGames = [
      {
        title: "Spider-Man: Miles Morales",
        image: "/placeholder.svg?height=300&width=200",
        description: "Action-adventure game featuring Miles Morales as Spider-Man",
        id: "spiderman-miles-morales",
      },
      {
        title: "God of War",
        image: "/placeholder.svg?height=300&width=200",
        description: "Action-adventure game following Kratos and Atreus",
        id: "god-of-war",
      },
      {
        title: "The Last of Us Part II",
        image: "/placeholder.svg?height=300&width=200",
        description: "Post-apocalyptic action-adventure game",
        id: "tlou2",
      },
      {
        title: "Ghost of Tsushima",
        image: "/placeholder.svg?height=300&width=200",
        description: "Open-world action-adventure set in feudal Japan",
        id: "ghost-tsushima",
      },
      {
        title: "Horizon Zero Dawn",
        image: "/placeholder.svg?height=300&width=200",
        description: "Action RPG in a post-apocalyptic world with robotic creatures",
        id: "horizon-zero-dawn",
      },
    ]

    const mockXboxGames = [
      {
        title: "Halo Infinite",
        image: "/placeholder.svg?height=300&width=200",
        description: "First-person shooter featuring Master Chief",
        id: "halo-infinite",
      },
      {
        title: "Forza Horizon 5",
        image: "/placeholder.svg?height=300&width=200",
        description: "Open-world racing game set in Mexico",
        id: "forza-horizon-5",
      },
      {
        title: "Microsoft Flight Simulator",
        image: "/placeholder.svg?height=300&width=200",
        description: "Realistic flight simulation game",
        id: "flight-simulator",
      },
      {
        title: "Age of Empires IV",
        image: "/placeholder.svg?height=300&width=200",
        description: "Real-time strategy game",
        id: "aoe4",
      },
      {
        title: "Sea of Thieves",
        image: "/placeholder.svg?height=300&width=200",
        description: "Multiplayer pirate adventure game",
        id: "sea-of-thieves",
      },
    ]

    return NextResponse.json({
      playstation: mockPlayStationGames,
      xbox: mockXboxGames,
      note: "This is fallback data. Real APIs may not be publicly accessible.",
    })
  } catch (error) {
    console.error("Error in fallback API:", error)
    return NextResponse.json({ error: "Fallback API failed" }, { status: 500 })
  }
}
