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
    "高中《世界史1之東亞史》": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm1/S1 his_east asia",
        "chapters": ["copyrightandcontent", "daoyan-1", "ch01-1", "ch02-2", "ch03-3", "ch04-4", "ch05-5", "ch06-6", "ch07", "ch08", "ch09", "DaShiNianBiao"]
    }/*,
    "高中《世界史2之近现代欧美、西亚和南亚史》（2024年使用）": {
        "link": "https://elearning.dongzong.my/dongzong/senior/",
        "chapters": []
    }*/,
    "高中《世界歷史》": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm2/world_his",
        "chapters": ["copyright&contents", "introduction", "Ch01-1", "ch2", "ch03", "ch04", "ch05", "ch06", "ch07", "Ch08-8", "ch09", "ch10", "ch11", "ch12", "ch13", "ch14", "ch15"]
    },
    "高中《馬來西亞及其東南亞鄰國史》": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm3/his_asean",
        "chapters": ["copyrightandcontent", "daoyan", "ch01", "ch02", "ch03", "ch04", "ch05", "ch06", "ch07", "ch08", "ch09", "ch10", "ch11", "dashinianbiao"]
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