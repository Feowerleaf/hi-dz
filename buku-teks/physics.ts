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
    "高中《物理》上冊": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm1/physics",
        "chapters": ["copyrightandcontent", "Ch01", "Ch02", "Ch03-1", "Ch03-2", "Ch04-1", "Ch04-2", "Ch05", "Ch06-1", "Ch06-2", "Ch07", "Ch08", "Ch09", "Ch10", "Ch11"]
    },
    "高中《物理》中冊": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm2/physics",
        "chapters": ["copyrightandcontent", "ch12", "ch13", "ch14", "ch15", "ch16 1-6", "ch16 7-10", "ch17 1-5", "ch17 6-7", "ch18 1-3", "ch18 4-6", "ch19", "ch20 1-3", "ch20 4-5"]
    },
    "高中《物理》下冊": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm3/physics",
        "chapters": ["copyrightandcontent", "ch21_1", "ch21_2", "ch22_1", "ch22_2", "ch23_1", "ch23_2", "ch24_1", "ch24_2", "ch25_1", "ch25_2", "ch26_1", "ch26_2", "ch27_1", "ch27_2",]
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