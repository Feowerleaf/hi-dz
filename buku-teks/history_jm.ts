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
    "初中《歷史》第一冊": {
        "link": "https://elearning.dongzong.my/dongzong/junior/jm1/history2022",
        "chapters": ["copyrightandcontent", "ch1", "ch2", "ch3", "ch4", "ch5.1", "ch5.2", "ch6"]
    },
    "初中《歷史》第二冊": {
        "link": "https://elearning.dongzong.my/dongzong/junior/jm2/history2022",
        "chapters": ["copyrightandcontent", "ch01_1", "ch1_2", "ch2_1", "ch2_2", "ch3", "ch4", "ch5"]
    },
    "初中《歷史》第三冊": {
        "link": "https://elearning.dongzong.my/dongzong/junior/jm3/history2022",
        "chapters": ["copyrightandcontent2022", "ch1", "ch2", "ch3", "ch4", "ch5", "ch6"]
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