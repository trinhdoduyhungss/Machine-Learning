let fs = require("fs");
let file_NL = fs.readFileSync('data_NL.txt').toString();
file_NL = file_NL.split("\r\n")
let file_stop_word = fs.readFileSync("stop_word.txt").toString();
file_stop_word = file_stop_word.split("\r\n")

function process(text) {
    text = text.replace(/[%!#√.*+?,;^${}()_`'"|[\]\\//]/g, " ")
    text = text.replace(/(\r\n\t|\n|\r)/gm, " ");
    text = text.replace(/[=]/g, " ");
    text = text.replace(/[:]/g, " ");
    text = text.replace(/[-]/g, " ");
    text = text.replace(/[>]/g, " ");
    text = text.replace(/[<]/g, " ");
    text = text.replace(/[@]/g, " ");
    text = text.replace(/\s+/g, ' ')
    text = text.replace(/[0-9]/g, ' ');
    text = text.toLocaleLowerCase()
    text = text.trim()
    text = text.trim()
    return text
}

function catch_windows(text, window_size){
    if (window_size % 2 === 0) {
        return 'Error! The window size must be an uneven number'
    }
    else {
        text = process(text)
        arr_text = text.split(" ")
        let result = []
        for (let i = 0; i <= arr_text.length; i++) {
            let arr_left = arr_text.slice(i, arr_text.length)
            if (arr_left.length >= window_size) {
                let focus_word = (Math.round(window_size / 2) + i) - 1
                let left_focus_word = arr_text.slice(focus_word - ((window_size - 1) / 2), focus_word)
                let rigth_focus_word = arr_text.slice(focus_word + 1, focus_word + ((window_size - 1) / 2) + 1)
                if(left_focus_word.indexOf('') == -1 && rigth_focus_word.indexOf('') == -1){
                    result.push(left_focus_word.concat(rigth_focus_word, arr_text[focus_word]))
                }else{
                    continue
                }
            }
            else {
                return result
            }
        }
    }
}

function readyData(data, window_size, size_data) {
    let data_return = []
    let filtered_stop_word = data.filter(function (value, index, arr) {
        return file_stop_word.includes(value) <= 0;
    });
    x = 0
    for (let i in filtered_stop_word) {
        if (filtered_stop_word[i] != '') {
            let arr_catch = catch_windows(filtered_stop_word[i], window_size)
            if (arr_catch.length != 0) {                
                for(let item in arr_catch) {
                    data_return.push(arr_catch[item])
                }
                x += 1
            }
        }
        if (x == size_data) {
            return data_return
        }
    }
}

let data_Save = readyData(file_NL, 3, 500)
fs.writeFile('windows_words(5).txt', JSON.stringify(data_Save), 'utf8', function (err) {
    if (err) {
        throw err;
    }
    else {
        console.log('Saved data windows!');
    }
});