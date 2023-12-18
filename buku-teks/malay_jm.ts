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
    "Bahasa Malaysia Junior 1 Jilid Pertama": {
        "link": "https://elearning.dongzong.my/dongzong/junior/jm1/bm1",
        "chapters": ["copyrightandcontent", "ch01", "ch02", "ch03", "ch04", "ch05", "ch06", "ch07", "ulangkaji A", "Lampiran"]
    },
    "Bahasa Malaysia Junior 1 Jilid Kedua": {
        "link": "https://elearning.dongzong.my/dongzong/junior/jm1/bm2",
        "chapters": ["copyrightandcontent", "ch08", "ch09", "ch10", "ch11", "ch12", "ch13", "ch14", "Ulangkaji B"]
    },
    "Bahasa Malaysia Junior 2 Jilid Pertama": {
        "link": "https://elearning.dongzong.my/dongzong/junior/jm2/bm1",
        "chapters": ["copyrightandcontent", "Ch01", "Ch02", "Ch03", "Ch04", "Ch05", "Ch06", "Ch07"]
    },
    "Bahasa Malaysia Junior 2 Jilid Kedua": {
        "link": "https://elearning.dongzong.my/dongzong/junior/jm2/bm2",
        "chapters": ["copyright&contents", "Ch08", "Ch09", "Ch10", "Ch11", "Ch12", "Ch13", "Ch14"]
    }
    ,
    "Bahasa Malaysia Junior 3 Jilid Pertama": {
        "link": "https://elearning.dongzong.my/dongzong/junior/jm3/bm1",
        "chapters": ["copyrightandcontent", "ch01", "ch02", "ch03", "ch04", "ch05", "ch06", "ch07"]
    }
    ,
    "Bahasa Malaysia Junior 3 Jilid Kedua": {
        "link": "https://elearning.dongzong.my/dongzong/junior/jm3/bm2",
        "chapters": ["copyrightandcontent", "ch08", "ch09", "ch10", "ch11", "ch12", "ch13", "ch14"]
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