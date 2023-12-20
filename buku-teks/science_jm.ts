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
    "《科學》初一上冊": {
        "link": "https://elearning.dongzong.my/dongzong/junior/jm1/science2023",
        "chapters": ["copyrightandcontent(2023)", "ch01(2023)", "ch02(2023)", "ch03(2023)", "ch04(2023)", "ch05(2023)", "ch06(2023)", "ch07(2023)"
        , "ch08(2023)", "ch09(2023)", "ch10(2023)", "diy01", "diy02", "diy03", "diy04", "appendix"]
    },
    "《科學》初一下冊": {
        "link": "https://elearning.dongzong.my/dongzong/junior/jm1/science(2)2023",
        "chapters": ["copyrightandcontent", "ch01", "ch02", "ch03", "ch04", "ch05", "ch06", "ch07", "ch08", "ch09", "ch10", "ch11", "DIY"]
    },
    "《科學》初二上冊": {
        "link": "https://elearning.dongzong.my/dongzong/junior/jm2/science1",
        "chapters": ["copyright&content", "ch01", "ch02", "ch03", "ch04", "ch05", "ch06", "ch07", "ch08", "ch09", "ch10", "ch11", "DIY(1)", "DIY(2)", "DIY(3)", "DIY(4)", "appendix"]
    },
    "《科學》初二下冊": {
        "link": "https://elearning.dongzong.my/dongzong/junior/jm2/science2",
        "chapters": ["copyright&contents", "ch01", "ch02", "ch03", "ch04", "ch05", "ch06", "ch07", "ch08", "ch09", "ch10", "ch11", "DIY", "periodic table"]
    },
    "《科學》初三上冊": {
        "link": "https://elearning.dongzong.my/dongzong/junior/jm3/science/science1",
        "chapters": ["copyrightandcontent1", "ch01", "ch02", "ch03", "ch04", "ch05", "ch06", "ch07", "ch08", "ch09", "ch10", "diy1", "diy2", "diy3", "diy4", "periodic table"]
    },
    "《科學》初三下冊": {
        "link": "https://elearning.dongzong.my/dongzong/junior/jm3/science/science2",
        "chapters": ["copyrightandcontent1", "ch01", "ch02", "ch03", "ch04_1", "ch05", "ch06", "ch07", "ch08", "ch09", "ch10_1", "ch11", "diy01", "diy02", "diy03", "diy04"]
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