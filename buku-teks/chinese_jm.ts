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
    "《華文》初一上冊": {
        "link": "https://elearning.dongzong.my/dongzong/junior/jm1/chinese/chinese1",
        "chapters": ["copyrightandcontent", "ch01", "ch02", "ch03", "ch04", "ch01_lt", "ch01_xz", "ch05", "ch06", "ch07", "ch08", "ch02_lt", "ch02_xz"
        , "ch09", "ch10", "ch11", "ch12", "ch03_lt", "ch03_xz", "ch13", "ch14", "ch15", "ch16", "ch04_lt", "ch04_xz", "ch17", "ch18", "ch19", "ch20", "ch05_lt"]
    },
    "《華文》初一下冊": {
        "link": "https://elearning.dongzong.my/dongzong/junior/jm1/chinese/chinese2",
        "chapters": ["copyrightandcontent", "ch01", "ch02", "ch03", "ch04", "ch01_lt", "ch01_xz", "ch05", "ch06", "ch07", "ch08", "ch02_lt", "ch02_xz"
        , "ch09", "ch10", "ch11", "ch12", "ch03_xz", "ch13", "ch14", "ch15", "ch16", "ch17", "ch18", "ch19", "ch20", "ch05_lt"]
    },
    "《華文》初二上冊": {
        "link": "https://elearning.dongzong.my/dongzong/junior/jm2/chinese1",
        "chapters": ["copyright&contents", "ch01_1", "ch01_2", "ch01_3", "ch01_4", "ch01_writing.2023", "ch02_5", "ch02_6", "ch02_7", "ch02_8", "ch02_listening&speaking"
        , "ch03_9", "ch03_10", "ch03_11", "ch03_12", "ch03_listening&speaking", "ch03_writing", "ch04_13", "ch04_14", "ch04_15", "ch04_16", "ch04_writing.2023", "ch05_17_2023", "ch05_18", "ch05_19", "ch05_20", "ch05_listening&speaking", "ch05_writting"]
    },
    "《華文》初二下冊": {
        "link": "https://elearning.dongzong.my/dongzong/junior/jm2/chinese2",
        "chapters": ["copyright&contents", "ch01-01", "ch01_2", "ch01_3", "ch01_4", "ch01_listening&speaking", "ch01_writing.2023", "ch02_5", "ch02_06", "ch02_07", "ch02_08", "ch02_writing"
        , "ch03_09", "ch03_10", "ch03_11", "ch03_12", "ch03_listening&speaking", "ch04_13", "ch04_14", "ch04_15", "ch04_16", "ch04_writing", "ch05_17", "ch05_18", "ch05_19", "ch05_20", "ch05_listening&speaking"]
    },
    "《華文》初三上冊": {
        "link": "https://elearning.dongzong.my/dongzong/junior/jm3/chinese1A",
        "chapters": ["copyrightandcontent-2023", "ch01-1", "ch01-2-2022", "ch1-3", "ch1-4", "ch01_writing", "ch02-5-2022", "ch02_06", "ch02_07", "ch02_08", "ch02_writing", "ch3-9", "ch03-10-2023", "ch03-11-2023", "ch03_12", "ch03_writing"
        , "ch04-13-2022",  "ch04-14-2023", "ch04-15-2023", "ch04-16-2023", "ch04-15-2023", "ch04_listening & speaking", "ch05-17-2022", "ch05-18-2023", "ch5_19", "ch05-20-2023", "ch05_writing"]
    },
    "《華文》初三下冊": {
        "link": "https://elearning.dongzong.my/dongzong/junior/jm3/chinese1B",
        "chapters": ["copyrightandcontent", "ch01-1-2022", "ch01.2.2022", "ch01.3.2022", "ch01.4.2022", "ch01_lingting", "ch02.6.2022", "ch02.7.2022", "ch02.8.2022", "ch2-xiezuo"
        , "ch03.9.2022", "ch03.10.2022", "ch03.11.2022", "ch03.12.2022", "ch3-lingting", "ch03_xiezuo", "ch04.13.2022",  "ch04.14.2022", "ch04.15.2022", "ch04.16.2022", "ch04_xiezuo", "ch05.17.2022", "ch05.18.2022", "ch05.19.2022", "ch05.20.2022", "ch05_lingting"]
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