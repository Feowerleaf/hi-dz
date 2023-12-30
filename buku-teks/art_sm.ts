import { exists } from "https://deno.land/std@0.204.0/fs/exists.ts";
import { decodeBase64 } from "https://deno.land/std@0.210.0/encoding/base64.ts"

const book_dir = "董總課本"
if (await exists(book_dir, {isReadable: true})) {
    if (await exists(book_dir, {isReadable: true, isFile: true})) {
        console.log(`There is a file with the name ${book_dir}`)
        Deno.exit(1)
    }
} else {
    await Deno.mkdir(book_dir, {"recursive": true}).then().catch((err)=> console.log(err))
}

function parsHexToNormalString(b){let c;for(c="";2<=b.length;)c+=String.fromCharCode(parseInt(b.substring(0,2),16)),b=b.substring(2,b.length);return c}

function rc4(b, c){
    for(var d=[],f=[],g=0;256>g;g++)d[g]=g,f[g]=b.charCodeAt(g%b.length);
    for(var h=0,g=0;256>g;g++){
        var h=h+d[g]+f[g]&255,k=d[g];d[g]=d[h];d[h]=k
    }
    for(var l=h=f=0,m,k="",g=0;g<c.length;g++)f=f+1&255,h=h+d[f]&255,l=d[f],d[f]=d[h],d[h]=l,l=d[f]+d[h]&255,m=c.charCodeAt(g),m^=d[l],k+=String.fromCharCode(m);
    return k
}

function decode(b){
    b=String(b);for(var c=b.length,d=0,f,g,h="",k=-1;++k<c;)g="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(b.charAt(k)),
f=d%4?64*f+g:g,d++%4&&(h+=String.fromCharCode(255&f>>(-2*d&6)));return h
}

function encode(b){
    b=String(b);if(/[^\0-\xFF]/.test(b))throw new g("The string to be encoded contains characters outside of the Latin1 range.");for(var c=b.length%3,d="",f=-1,h,k,s,r=b.length-c;++f<r;)h=b.charCodeAt(f)<<
16,k=b.charCodeAt(++f)<<8,s=b.charCodeAt(++f),h=h+k+s,d+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(h>>18&63)+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(h>>12&63)+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(h>>6&63)+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(h&63);2==c?(h=b.charCodeAt(f)<<8,k=b.charCodeAt(++f),h+=k,d+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(h>>
10)+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(h>>4&63)+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(h<<2&63)+"="):1==c&&(h=b.charCodeAt(f),d+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(h>>2)+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(h<<4&63)+"==");
return d}

console.log(`Books will be saved in subfolder ${book_dir}`)
const links = {
    "高中《美術》（全一冊）": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm3/art",
        "chapters": ["copyrightandcontent", "introduction", "ch01", "ch02", "ch03", "ch04", "ch05", "ch06", "ch07", "ch08", "ch09", "ch10", "ch11", "ch12", "ch13", "ch14", "ch15", "Ch15", "ch016", "ch17", "ch18", "ch19", "ch20", "ch21", "ch022", "ch23", "ch24", "ch25", "ch26"]
    },
    "高中《美術賞析》第一冊": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm1/artap",
        "chapters": ["copyright&contents", "ch01(1.1-1.4)", "ch01(1.5)", "ch02.2023", "ch03(2023)", "ch04", "ch05(2)2023", "ch05(1)2023", "ch06(2023)", "ch07(2023)", "ch08(2023)", "ch09(2023)", "ch10(10.1)2023", "ch10(10.2)2023", "ch11(11.1)2023", "ch11(11.2)2023"]
    },
    "高中《美術賞析》第二冊": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm2/art2023",
        "chapters": ["copyrightandcontent(2023)2", "ch01(2023)", "ch02(2023)", "ch03(2023)3.1", "ch03(2023)3.2", "ch04(2023)", "ch05(5.1)2023", "ch05(5.2)2023", "ch06(6.1)2023", "ch06(6.2)2023", "ch07(7.1)2023", "ch07(7.2)2023", "ch08(8.1)2023", "ch08(8.2)2023"]
    },
    "高中《美術賞析》第三冊": {
        "link": "https://elearning.dongzong.my/dongzong/senior/sm3/art2023",
        "chapters": [/*No cover page found, and "ch01(2023)2" links to 高中《美術》（全一冊）, blame DZ*/ "ch02(2023)", "ch03(2023)", "ch03(2023)2", "ch04"]
    }
}

for (const book in links) {
    try {
        Deno.readDirSync(`./${book_dir}/${book}`)
        continue
    } catch (_err) {
        try {
            Deno.mkdirSync(`./${book_dir}/${book}`)
            console.log(`Created directory for ${book}`)
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
        if (i_page == 1) {
            const res = await fetch(`${links[book].link}/${links[book]["chapters"][chapter]}/mobile/javascript/config.js`)
            if (res.headers.get("content-type") == "application/javascript") {
                console.log(`Fetched config.js for ${links[book]["chapters"][chapter]}`)
                const regex = /bookConfig\.singlePasswordKey[^"]*"([^"]*)"/
                const match = regex.exec(await res.text());
                let singlePasswordKey;
                if (match) {
                    singlePasswordKey = match[1]
                }
                let singleRealKey = rc4("dze23", parsHexToNormalString(singlePasswordKey))
                while (true) {
                    const res = await fetch(`${links[book].link}/${links[book]["chapters"][chapter]}/files/mobile/${i_page}.js`)
                    if (res.headers.get("content-type") == "application/javascript") {
                        console.log(`Fetching ${links[book].link}/${links[book]["chapters"][chapter]}/files/mobile/${i_page}.js`)
                        const page_regex = /=[^"]*"([^"]*)"/
                        const ciphered = page_regex.exec(await res.text())
                        if (ciphered) {
                            let page_var_dc = decode(ciphered[1])
                            let rr = rc4(singleRealKey, page_var_dc)
                            const file = await Deno.writeFile(`./${book_dir}/${book}/${book}_${links[book]["chapters"][chapter]}_${i_page}.jpg`, decodeBase64(encode(rr)))
                        }
                    } else break;
                    i_page++
                }
            }
        }
    }
}
