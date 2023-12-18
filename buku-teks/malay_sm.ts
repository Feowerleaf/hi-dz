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
    "Bahasa Malaysia Menengah Tinggi Satu": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm1/bm",
        "chapters": ["unit01", "unit02", "unit03", "unit04", "unit05", "unit06", "unit07", "unit08", "unit09", "unit10"]
    },
    "Bahasa Malaysia Menengah Tinggi Dua": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm2/bm2",
        "chapters": ["copyrightandcontent", "unit01", "unit02", "unit03", "unit04", "unit05", "unit06", "unit07", "unit08", "unit09", "unit10"]
    }
    ,
    "Bahasa Malaysia Menengah Tinggi Tiga": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm3/bm",
        "chapters": ["copyrightandcontent", "unit 1", "unit2", "unit3", "unit4", "unit5", "unit6", "unit7", "unit8", "unit9", "unit10"]
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