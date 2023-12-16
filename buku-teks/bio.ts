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
    "高中《生物》上冊": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm1/biology",
        "chapters": ["copyright&contents", "introduction", "ch01-2022", "ch02-1-sep", "ch02-2", "ch03-1", "ch03_2", "ch04-2022-sep", "ch05-2022-sep", "ch06-2022-sep", "ch07-1-2022-sep", "ch07-2-2022-sep", "ch08-2022-sep", "ch09(9.1-9.3)", "ch09-2-2022-sep"]
    },
    "高中《生物》中冊": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm2/biology2023",
        "chapters": ["copyright&copyrightpageandcontent(2023)", "ch10(2023)", "ch11(2023)_Neat", "ch12(2023)1", "ch12(2023)2", "ch13(2023)", "ch14(2023)1-3", "ch14(2023)4-5", "ch15(2023)", "ch16(2023)"]
    },
    "高中《生物》下冊": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm3/biology",
        "chapters": ["copyrightandcontent", "ch17(2023)", "ch18(2023)", "ch19(2023)"]
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
    if (book == "高中《生物》下冊") {
        links[book]["link"] = "https://elearning.dongzong.my/dongzong/senior/sm3/biology2023"
        for (let i = 1; i < links[book]["chapters"].length; i++) {
            let i_page = 1 
            while (true) {
                const res = await fetch(`${links[book].link}/${links[book]["chapters"][i]}/files/mobile/${i_page}.jpg`)
                if (res.headers.get("content-type") == "image/jpeg") {
                    console.log(`Fetching ${links[book].link}/${links[book]["chapters"][i]}/files/mobile/${i_page}.jpg`)
                    const file = await Deno.open(`./${book_dir}/${book}/${book}_${links[book]["chapters"][i]}_${i_page}.jpg`, { create: true, write: true})
                    await res.body?.pipeTo(file.writable)
                } else break;
                i_page++
            }
        }
    }
}