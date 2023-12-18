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
    "《高中數學》高一上冊": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm1/maths1",
        "chapters": ["copyright&contents", "ch01", "ch02(2.1-2.4)", "ch02(2.5-2.7)", "ch03", "ch04", "ch05", "ch06", "noun", "ans"]
    },
    "《高中數學》高一下冊": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm1/maths2",
        "chapters": ["copyright&contents", "ch07", "ch08", "ch09(9.1-9.2)", "ch09(9.3-9.4)", "ch10", "ch11", "noun", "answer"]
    }
    ,
    "《高中數學》高二上冊": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm2/maths1",
        "chapters": ["copyrightandcontent", "ch12", "ch13", "ch14(14.1-14.5)", "ch14(14.6-14.8)", "ch15(15.1-15.4)", "ch15(15.5-15.8)", "ch16", "ch17(17.1-17.4)", "ch17(17.5-17.6)", "ming ci", "ans"]
    },
    "《高中數學》高二下冊": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm2/maths2",
        "chapters": ["copyrightandcontent", "ch18(18.1-18.4)", "ch18(18.5-18.7)", "ch19(19.1-19.3)", "ch19(19.4-19.6)", "ch20", "ch21(21.1-21.3)", "ch21(21.4-21.6)", "ming ci", "ans"]
    }
    ,
    "《高中數學》高三上冊": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm3/maths1",
        "chapters": ["copyrightandcontents", "ch22(22.1-22.4)", "ch22(22.5-22.6)", "ch23(23.1-23.3)", "ch23(23.4-23.6)", "ch24", "ch25(25.1-25.5)", "ch25(25.6-25.10)", "mingciduizhao", "ans"]
    },
    "《高中數學》高三下冊": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm3/maths2",
        "chapters": ["copyrightandcontent", "ch26", "ch27", "ch28", "mingciduizhao", "ans"]
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