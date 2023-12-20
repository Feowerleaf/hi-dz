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
    "高中《美術》（全一冊）": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm3/art",
        "chapters": ["copyrightandcontent", "introduction", "ch01", "ch02", "ch03", "ch04", "ch05", "ch06", "ch07", "ch08", "ch09", "ch10", "ch11", "ch12", "ch13", "ch14", "ch15", "Ch15", "ch016", "ch17", "ch18", "ch19", "ch20", "ch21", "ch022", "ch23", "ch24", "ch25", "ch26"]
    },
    "高中《美術賞析》第一冊": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm1/artap",
        "chapters": ["copyright&contents", "ch01(1.1-1.4)", "ch01(1.5)", "ch02.2023", "ch03(2023)", "ch04", "ch05(2)(2023)", "ch05(1)(2023)", "ch06(2023)", "ch07(2023)", "ch08(2023)", "ch09(2023)", "ch10(10.1)2023", "ch10(10.2)2023", "ch11(11.1)2023", "ch11(11.2)2023"]
    },
    "高中《美術賞析》第二冊": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm2/art2023",
        "chapters": ["copyrightandcontent(2023)", "ch01(2023)", "ch02(2023)", "ch03(2023)3.1", "ch03(2023)3.2", "ch04(2023)", "ch05(5.1)2023", "ch05(5.2)2023", "ch06(6.1)2023", "ch06(6.2)2023", "ch07(7.1)2023", "ch07(7.2)2023", "ch08(8.1)2023", "ch08(8.2)2023"]
    },
    "高中《美術賞析》第三冊": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm3/art2023",
        "chapters": ["ch01(2023)", "ch01(2023)2", "ch02(2023)", "ch03(2023)", "ch03(2023)2", "ch04"]
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