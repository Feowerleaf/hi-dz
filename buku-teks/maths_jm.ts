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
    "《數學》初一上冊": {
        "link": "https://elearning.dongzong.my/dongzong/junior/jm1/maths1",
        "chapters": ["copyright&contents", "ch01", "ch02", "ch03", "ch04(1-4)", "ch04(4.5-4.8)", "ch05", "ch06", "ch07", "answer"]
    },
    "《數學》初一下冊": {
        "link": "https://elearning.dongzong.my/dongzong/junior/jm1/maths2",
        "chapters": ["copyright&contents", "ch08", "ch09", "ch10", "ch11", "ch12(12.1-12.5)", "ch12(12.6-12.8)", "ch13", "ch14", "ans"]
    },
    "《數學》初二上冊": {
        "link": "https://elearning.dongzong.my/dongzong/junior/jm2/maths1",
        "chapters": ["copyright&contents", "ch01", "ch02", "ch03", "ch04(4.1-4.2)", "ch04(4.3)", "ch04(4.4-4.5)", "ch05(5.1-5.5)", "ch05(5.6-5.9)", "ch06", "noun", "ans"]
    },
    "《數學》初二下冊": {
        "link": "https://elearning.dongzong.my/dongzong/junior/jm2/maths2",
        "chapters": ["copyrightandcontent", "ch07", "ch08", "ch09", "ch10", "ch11-2022", "ch12", "ch13", "ch14", "noun", "ans"]
    },
    "《數學》初三上冊": {
        "link": "https://elearning.dongzong.my/dongzong/junior/jm3/maths1",
        "chapters": ["copyrightpage&content", "ch01", "ch02_1", "ch3(3.1-3.2)", "ch03 3-4", "ch04", "ch05(5.1)", "ch05(5.2-5.3)", "ch06(6.1-6.4)", "ch06(6.5-6.8)", "ans"]
    },
    "《數學》初三下冊": {
        "link": "https://elearning.dongzong.my/dongzong/junior/jm3/maths2",
        "chapters": ["copyright&content", "ch07", "ch08(8.1-8.3)", "ch08(8.4-8.6)", "ch09", "ch10", "ans"]
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