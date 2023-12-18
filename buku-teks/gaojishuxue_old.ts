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
    "《高級數學》高一上冊": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm1/addmaths1",
        "chapters": ["copyrightandcontent", "ch1 1-3", "ch01 4-6", "ch02", "ch03", "ch04", "ch05", "ch06", "ch07", "ch08", "ch09", "ch10", "ming ci", "ans"]
    },
    "《高級數學》高一下冊": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm1/addmaths2",
        "chapters": ["copyrightandcontent", "ch011", "ch012", "ch13", "ch014", "ch015", "ch16", "ch17", "ming ci", "answer"]
    }
    ,
    "《高級數學》高二上冊": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm2/addmaths1",
        "chapters": ["copyrightpageandcontent", "ch01", "ch02", "Ch03", "ch04-1", "ch05-1", "ch06", "ch07", "ch08", "ch09", "ming ci", "ans"]
    },
    "《高級數學》高二下冊": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm2/addmaths2",
        "chapters": ["copyrightpageandcontent", "ch10", "ch11", "ch12", "ch13", "ch14-1", "ch15", "ch16", "ming ci", "ans"]
    }
    ,
    "《高級數學》高三上冊": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm3/addmaths1",
        "chapters": ["ch01", "ch02", "ch03", "ch04", "ch05", "ch06", "ch07", "ch08", "ch09_1", "ch09_2", "mingciduizhao", "answer"]
    },
    "《高級數學》高三下冊": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm3/addmaths2",
        "chapters": ["ch10", "ch11", "ch12", "ch13", "mingciduizhao", "answer"]
    }
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
    for (const chapter in links[book]["chapters"]) {
        let i_page = 1 
        while (true) {
            const res = await fetch(`${links[book].link}/${links[book]["chapters"][chapter]}/files/mobile/${i_page}.jpg`)
            if (res.headers.get("content-type") == "image/jpeg") {
                console.log(`Fetching ${links[book].link}/${links[book]["chapters"][chapter]}/files/mobile/${i_page}.jpg`)
                const file = await Deno.open(`./${book_dir}/${book}/${book}_${links[book]["chapters"][chapter]}_${i_page}.jpg`, { create: true, write: true})
                await res.body?.pipeTo(file.writable)
            } else break;
            i_page++
        }
    }
}