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
    "高中《簿記與會計》參考書1": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm1/account",
        "chapters": ["copyright&contents", "Ch01", "Ch02", "Ch03", "Ch04", "Ch05", "Ch06", "Ch07", "Ch08", "Ch09", "Ch10", "Ch11", "Ch12"]
    },
    "高中《簿記與會計》參考書2": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm2/account",
        "chapters": ["copyrightandcontent", "Ch13", "Ch14", "Ch15", "Ch16", "Ch17", "Ch18", "Ch19", "Ch20", "Ch21"]
    },
    "高中《簿記與會計》參考書3": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm3/account",
        "chapters": ["copyrightandcontent1", "ch22", "ch_23", "ch24", "ch25", "ch26", "ch27", "ch28", "ch29", "ch30", "appendix"]
    },
    "會計學參考書": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm3/accounting ref",
        "chapters": ["copyright&contents", "ch01", "ch02", "ch03", "ch04", "ch05", "ch06", "ch07", "ch08", "ch09", "ch10", "ch11", "Appendix"]
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