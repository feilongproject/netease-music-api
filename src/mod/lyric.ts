/**
 * 当url的SearchParams中的conver为以下值时,执行操作：
 * 1:返回原始歌词,格式为lrc;
 * 2:返回翻译歌词,格式为lrc;
 * 3:返回原始歌词与翻译合并后结果,格式为lrc;
 * 其他值或为空:返回原始数据,格式为json;
 * @param query 传入URLSearchParams
 * @returns 返回response
 */
export async function lyric(query: URLSearchParams): Promise<Response> {

    var id = query.get("id")
    if (!id) return new Response("no id")

    console.log(`start get lyric,id: ${id}`)

    var res = await fetch(`https://music.163.com/api/song/lyric?id=${id}&lv=-1&kv=-1&tv=-1`).then(res => {
        var text = res.text()
        return text
    }).then(res => {
        //console.log(`geted lyric: ${res}`)
        return res
    })

    var conver = query.get("conver")
    var decode: lyricDef = JSON.parse(res)
    switch (conver) {
        case "1": return new Response(decode.lrc.lyric)
        case "2": return new Response(decode.tlyric.lyric)
        case "3": return new Response(mergeLrc(decode.lrc.lyric, decode.tlyric.lyric))
        default: return new Response(res)

    }

}
/**
 * 将原歌词与翻译歌词合并
 * @param soureLrc 原版歌词
 * @param transLrc 翻译版歌词
 * @returns 合并后歌词
 */
function mergeLrc(soureLrc: string, transLrc: string): string {

    var sLrcCut = soureLrc.split(/\n/)
    var tLrcCut = transLrc.split(/\n/)
    //console.log(`sLrcCut.length: ${sLrcCut.length}, tLrcCut.length: ${tLrcCut.length}, max: ${Math.max(sLrcCut.length, tLrcCut.length)}`)

    var siv = 0, tiv = 0
    var mergeLrc = ""


    var timePattern = /^\[.*?\]/
    for (var i = 0; (i < Math.max(sLrcCut.length, tLrcCut.length)) && (sLrcCut[siv] && tLrcCut[tiv]); i++) {
        if (tLrcCut[tiv] && tLrcCut[tiv].startsWith("[by:")) {
            tiv++;
            continue
        }
        //console.log(sLrcCut[siv])
        //console.log(tLrcCut[tiv])


        var sLineTime: any = timePattern.exec(sLrcCut[siv])
        var tLineTime: any = timePattern.exec(tLrcCut[tiv])
        var sLineLrc = sLrcCut[siv].split(/^\[.*?\]/)[1]
        var tLineLrc = tLrcCut[tiv].split(/^\[.*?\]/)[1]
        //console.log(sLineCut)

        //console.log(`${sLineTime}--${tLineTime}    ${siv}-${tiv}`)

        var stime = ConverTime(sLineTime[0].split(/[\[\]]/)[1])
        var ttime = ConverTime(tLineTime[0].split(/[\[\]]/)[1])
        //console.log(`${stime}--${ttime}`)


        if (stime == ttime) siv++, tiv++, mergeLrc += `${sLineTime[0]}${sLineLrc}${sLineLrc == tLineLrc ? `` : `【${tLineLrc}】`}\n`
        else if (stime < ttime) siv++, mergeLrc += `${sLineTime[0]}${sLineLrc}\n`




    }

    return mergeLrc
}
/**
 * 将xx:yy.zz的时间转化为数字
 * @param time 传入形如xx:yy.zz的时间字符串
 * @returns 返回数字类型的时间
 */
function ConverTime(time: string) {
    //console.log(time)
    var m = parseInt(time.split(/:/)[0])
    var s = parseFloat(time.split(/:/)[1])
    return m * 60 + s

}