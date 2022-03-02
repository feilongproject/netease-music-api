import { lyric } from "./mod/lyric"
import { playurl } from "./mod/play"

async function Main(request: Request): Promise<Response> {

    const requestURL = new URL(request.url)
    const { pathname } = requestURL
    const pathPart = (pathname + "/").replaceAll("//", "/").split("/")

    //console.log(JSON.stringify(pathPart))

    var idi = requestURL.searchParams.get("id")
    if (!idi) return new Response("no id")
    var id = parseInt(idi)

    switch (pathPart[1]) {
        case "lyric": return await lyric(id, requestURL.searchParams.get("conver"))
        case "play":
            var brr = requestURL.searchParams.get("br")
            if (brr)
                return await playurl(id, parseInt(brr))
            else return await playurl(id, 1280000)
        default:
            return new Response("")
    }


}


addEventListener("fetch", (event) => {
    event.respondWith(
        Main(event.request).catch(
            (err) => new Response(err.stack, { status: 500 })
        )
    );
})