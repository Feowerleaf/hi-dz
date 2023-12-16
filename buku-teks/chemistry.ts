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
    "高中《化學》上冊": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm1/chemistry",
        "chapters": ["copyright&contents", "introduction", "Ch01", "Ch02", "Ch03", "Ch04", "Ch05", "Ch06", "Ch07", "Ch08", "Ch09", "Ch10", "Ch11", "Ch12", "Ch13", "Ch14-1", "Ch14-2", "Ch15", "Ch16", "appendix", "chsample"]
    },
    "高中《化學》中冊": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm2/chemistry",
        "chapters": ["copyrightpageandcontent", "ch17 1-5", "ch17 6-9", "ch18 1-7", "ch18 8-9", "ch19", "ch20-1", "ch21", "ch22", "ch23 1-4", "ch23 5-6", "ch24 1-3", "ch24 4", "ch25"]
    },
    "高中《化學》下冊": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm3/chemistry",
        "chapters": ["copyrightandcontent", "ch26", "ch27", "ch28", "ch29", "ch30", "ch31", "ch32", "ch33", "ch34", "ch35", "appendix1", "appendix2"]
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