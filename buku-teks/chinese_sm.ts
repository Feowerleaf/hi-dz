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
    "高中《華文》高一上冊": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm1/chinese1",
        "chapters": ["copyrightandcontent", "ch01", "ch02", "ch03", "ch04", "ch05(1)", "ch05(2)", "xiezuo", "tingshuo", "yuwen"]
    },
    "高中《華文》高一下冊": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm1/chinese2",
        "chapters": ["copyrightandcontent", "ch01", "ch02", "ch03", "ch04(4.15-4.16)", "ch04(4.17-4.18)", "ch05", "xiezuo", "tingshuo", "yuwen"]
    },
    "高中《華文》高二上冊": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm2/chinese1",
        "chapters": ["copyrightandcontent", "ch01-2022", "ch02-2022", "ch03-2022", "ch04-2022", "ch05-2022", "XieZuo", "TingShuo", "YuWen"]
    },
    "高中《華文》高二下冊": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm2/chinese2",
        "chapters": ["copyrightandcontents", "ch01", "ch02", "ch03", "ch04", "ch05", "xiezuo", "tingshuo", "yuwen"]
    },
    "高中《華文》高三上冊": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm3/chinese1",
        "chapters": ["copyrightandcontent", "ch01", "ch02", "ch03", "ch04", "ch05", "xiezuo", "tingshuo", "yuwen"]
    },
    "高中《華文》高三下冊": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm3/chinese2",
        "chapters": ["copyrightandcontent_1", "ch01", "ch02", "ch03", "ch04", "ch05", "xiezuo", "tingshuo", "yuwen"]
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