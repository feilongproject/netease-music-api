import { lyric } from "./mod/lyric"

async function Main(request: Request): Promise<Response> {

    const requestURL = new URL(request.url)
    const { pathname } = requestURL
    const pathPart = (pathname + "/").replaceAll("//", "/").split("/")

    //console.log(JSON.stringify(pathPart))

    switch (pathPart[1]) {
        case "lyric": return await lyric(requestURL.searchParams)

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