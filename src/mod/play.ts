/**
 * 获取播放链接
 * @param id 歌曲id号
 * @param br 音质(默认为普通)
 * @returns 返回response
 */
export async function playurl(id: number, br: number): Promise<Response> {



    console.log(`start get lyric,id: ${id}`)

    var res = await fetch(`https://music.163.com/api/song/enhance/player/url?id=${id}&ids=[${id}]&br=${br}`).then(res => {
        var text = res.text()
        console.log(text)
        return text
    }).then(res => {
        //console.log(`geted lyric: ${res}`)
        return res
    })

    var json = JSON.parse(res)
    json.soureurl = `https://music.163.com/api/song/enhance/player/url?id=${id}&ids=[${id}]&br=${br}`


    return new Response(JSON.stringify(json))

}

