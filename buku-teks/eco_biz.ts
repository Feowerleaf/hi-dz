import { exists } from "https://deno.land/std@0.204.0/fs/exists.ts";

const book_dir = "董總課本"
if (await exists(book_dir, {isReadable: true})) {
    if (await exists(book_dir, {isReadable: true, isFile: true})) {
        console.log(`There is a file with the name ${book_dir}`)
        Deno.exit(1)
    }
} else {
    await Deno.mkdir(book_dir, {"recursive": true}).then().catch((err)=> console.log(err))
}

console.log(`Books will be saved in subfolder ${book_dir}`)
const links = {
    "高中經濟學上冊": {"copyright": "copyright&contents", "link": function (ch:string) {
        return `https://elearning.dongzong.my/dongzong/senior/sm1/economics/${ch}/files/mobile/`
    }},
    "高中經濟學下冊": {"copyright": "copyrightandcontent", "link": function (ch:string) {
        return `https://elearning.dongzong.my/dongzong/senior/sm3/economy/${ch}/files/mobile/`
    }},
    "高中《商業學》第一冊": {"copyright": "copyright&contents", "link": function (ch:string) {
        return `https://elearning.dongzong.my/dongzong/senior/sm1/business/${ch}/files/mobile/`
    }},
    "高中《商業學》第二冊": {"copyright": "copyrightandcontent", "link": function (ch:string) {
        if (isNaN(ch.slice(-1))) return `https://elearning.dongzong.my/dongzong/senior/sm2/business/${ch}/files/mobile/`
        else if (parseInt(ch.slice(-1)) > 3) return `https://elearning.dongzong.my/dongzong/senior/sm2/business/${ch}/files/mobile/`
        else  return `https://elearning.dongzong.my/dongzong/senior/sm2/business/${ch}-1/files/mobile/`
    }},
    "高中《商業學》第三冊": {"copyright": "copyrightandcontent", "link": function (ch:string) {
        return `https://elearning.dongzong.my/dongzong/senior/sm3/business/${ch}/files/mobile/`
    }}
}

for (const book in links) {
    try {
        Deno.readDirSync(`./${book_dir}/${book}`)
        continue
    } catch (_err) {
        try {
            Deno.mkdirSync(`./${book_dir}/${book}`)
        } catch (_err) {
            console.log("-.-'")
        }
    }
    let link = `${links[book].link(`${links[book].copyright}`)}`
    let i_page = 1 
    while (true) {
        const res = await fetch(link+`${i_page}`+".jpg")
        if (res.headers.get("content-type") == "image/jpeg") {
            console.log(link+`${i_page}`+".jpg")
            const file = await Deno.open(`./${book_dir}/${book}/${book}_${links[book]["copyright"]}_${i_page}.jpg`, { create: true, write: true})
            await res.body?.pipeTo(file.writable)
        } else break;
        i_page++
    }
    let ch = 1
    let trail_z = false
    let check_t = false
    while (true) {
        i_page = 1
        if (trail_z) link = `${links[book].link("ch0"+ch)}`
        else link = `${links[book].link("ch"+ch)}`
        let last_ch = false;
        while (true) {
            const res = await fetch(link+`${i_page}`+".jpg")
            if (res.headers.get("content-type") == "image/jpeg") {
                console.log(link+`${i_page}`+".jpg")
                const file = await Deno.open(`./${book_dir}/${book}/${book}_ch${ch}_${i_page}.jpg`, { create: true, write: true})
                await res.body?.pipeTo(file.writable)
            } else {
                if (i_page > 1) {check_t = false; break}
                if (check_t) {last_ch = true; break;}
                if (i_page == 1) {
                    trail_z = !trail_z
                    check_t = true
                    ch--
                }
                break
            }
            i_page++
        }
        ch++
        if (last_ch) break;
    }
}
