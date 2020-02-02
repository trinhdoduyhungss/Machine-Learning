let fs = require("fs");
let data_windows_words = fs.readFileSync('windows_words(5).txt').toString();
data_windows_words = JSON.parse(data_windows_words)
function create_onehot(file, char, size) {
    try{
        let data_one_hot = fs.readFileSync('one_hot_words(7).json', 'utf8')
        data_one_hot = JSON.parse(data_one_hot);
        return data_one_hot
    }
    catch{
        function create (file, char, size) {
            let fs = require("fs");
            let file_NL = fs.readFileSync(file).toString();
            file_NL = file_NL.split(char)
            let full_data = ''
            let data_vec_voc = {}
            let pad_ = []
        
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
        
            for (let i in file_NL) {
                full_data += file_NL[i].toLocaleLowerCase() + ' '
            }
        
            if (full_data != '') {
                let array_data = full_data.split(" ")
                let file_stop_word = fs.readFileSync("stop_word.txt").toString();
                file_stop_word = file_stop_word.split("\r\n")
                file_stop_word = file_stop_word.filter(function (value, index, arr) {
                    return value.length > 1;
                });
                
                for (let i in array_data) {
                    if (array_data[i] != '') {
                        let vector = []
                        for (let i = 1; i <= size; i++) {
                            vector.push(Math.floor(Math.random() * 2))
                        }
                        if (vector.length == size) {
                            data_vec_voc[process(array_data[i])] = vector
                            pad_.push(vector.length)
                        }
                    }
                }
                if (Object.keys(data_vec_voc).length > 0) {
                    let json = JSON.stringify(data_vec_voc);
                    fs.writeFile('one_hot_words(7).json', json, 'utf8', function (err) {
                        if (err) {
                            console.log(err)
                            throw err;
                        }
                        else {
                            console.log('Saved data vector!');
                        }
                    });
                    return data_vec_voc
                }
            }
        }
        let data_one_hot = create(file, char, size)
        if(data_one_hot != undefined){
            return data_one_hot
        }
    }
}
function crate_W(x, y) {
    let W = []
    for (let i = 1; i <= y; i++) {
        let x_m = []
        for (let j = 1; j <= x; j++) {
            x_m.push(Math.random())
        }
        if (x_m.length > 0) {
            W.push(x_m)
        }
    }
    if (W.length != 0) {
        return W
    }
}
function rotating_array(W) {
    let result_W = []
    for (let j = 0; j < W[0].length; j++) {
        let x_W = []
        for (let i in W) {
            x_W.push(W[i][j])
        }
        if (x_W.length > 0) {
            result_W.push(x_W)
        }
    }
    if (result_W.length > 0) {
        return result_W
    }
}
function mashup(matrix) {
    let result = matrix[0]
    for (let i = 1; i < matrix.length; i++) {
        for (let j in matrix[i]) {
            result[j] += matrix[i][j]
        }
    }
    return result
}
function average(matrix) {
    let matrix_mashup = mashup(matrix)
    let result = []
    for (let i in matrix_mashup) {
        result.push(matrix_mashup[i] / matrix.length)
    }
    if (result.length != 0) {
        return result
    }
}
function dot(matrix1, matrix2, type) {
    if (type == 'MxM') {
        let result = []
        for (let item in matrix1) {
            let contain_matrix = []
            for (let i in matrix1[item]) {
                let line = []
                for (let j in matrix2[i]) {
                    line.push(matrix1[item][i] * matrix2[i][j])
                }
                if (line.length > 0) {
                    contain_matrix.push(line)
                }
            }
            if (contain_matrix.length > 0) {
                result.push(mashup(contain_matrix))
            }
        }
        if (result.length > 0) {
            return result
        }
    }
    if (type == 'NxA') {
        let result = []
        for (let word in matrix1) {
            for (let item in matrix1[word]) {
                let line = []
                for (let i in matrix2) {
                    line.push(matrix1[word][item] * matrix2[i])
                }
                if (line.length > 0 && line.length == matrix2.length) {
                    result.push(line)
                }
            }
        }
        if (result.length > 0) {
            return result[0]
        }
    }
    if (type == 'NxM') {
        let result = []
        for (let i in matrix2) {
            let line = []
            for (let item in matrix2[i]) {
                line.push(matrix2[i][item] * matrix1)
            }
            if (line.length > 0 && line.length == matrix2[i].length) {
                result.push(line)
            }
        }
        if (result.length > 0) {
            return result
        }
    }
}
function outers(list_arr1, list_arr2) {
    let result = []
    for (let word in list_arr1) {
        for (let item in list_arr1[word]) {
            let line = []
            for (let i in list_arr2) {
                for (let j in list_arr2[i]) {
                    line.push(list_arr1[word][item] * list_arr2[i][j])
                }
                if (line.length > 0 && line.length == list_arr2[i].length) {
                    result.push(line)
                }
            }
        }
    }
    if (result.length > 0) {
        return mashup(result)
    }
}
function softmax(arr) {
    return arr.map(function (value, index) {
        return Math.exp(value) / arr.map(function (y /*value*/) { return Math.exp(y) }).reduce(function (a, b) { return a + b })
    })
}
function exps(A) {
    let result = []
    for (let i in A) {
        result.push(Math.exp(A[i]))
    }
    if (result.length > 0) {
        return result
    }
}
function sum(Arrs) {
    let result = 0
    for (let i in Arrs) {
        result += Arrs[i]
    }
    if (result.length != 0) {
        return result
    }
}
function subtract(N, S) {
    let result = []
    for (let i in S) {
        result.push(S[i] - N[i])
    }
    if (result.length > 0) {
        return result
    }
}
function update_W2(fix, W2) {
    let result = []
    for (let i in W2) {
        let line = []
        for (let k in W2[i]) {
            line.push(W2[i][k] - fix[i])
        }
        if (line.length != 0) {
            result.push(line)
        }
    }
    if (result.length > 0) {
        return rotating_array(result)
    }
}
function update_W1(fix, W1) {
    let result = []
    for (let i in W1) {
        let line = []
        for (let k in W1[i]) {
            line.push(W1[i][k] - fix[i])
        }
        if (line.length != 0) {
            result.push(line)
        }
    }
    if (result.length > 0) {
        return rotating_array(result)
    }
}
function train(data, focus_word, W1, W2) {
    try {
        let hidden_layers = average(dot(data, W1, 'MxM'))
        let output_layers = dot([hidden_layers], W2, 'MxM')
        let output_softmax = softmax(output_layers[0])
        let error = subtract(focus_word, output_softmax)
        let loss_train = -output_softmax[focus_word.indexOf(1)] + Math.log(sum(exps(output_softmax)))
        let up1 = update_W2(dot([[alpha]], outers([error], [hidden_layers]), 'NxA'), W2)
        let up2 = update_W1(dot([[alpha]], outers([focus_word], dot([error], W2, 'MxM')), 'NxA'), W1)
        W2 = up1
        W1 = up2
        W_c1 = W1
        W_c2 = W2
        if (isNaN(loss_train)||loss_train == Infinity) {
            return []
        } else {
            return output_softmax
        }
    } catch (error) {
        console.log('Error!Please check size of matrix')
    }
}
function run(K){
    let dict_words = {}
    for(let i in data_windows_words){
        let data_train_words = []
        for(let item in data_windows_words[i]){
            if(data_train_words.length <= K){
                data_train_words.push(data_windows_words[i][item])
            }
        }
        if(data_train_words.length == K){
            let data_words = data_train_words.splice(0, data_train_words.length - 1)
            let target_words = data_train_words 
            let data = []
            for (let word in data_words) {
                if(data_one_hot[data_words[word]] != undefined){
                    data.push(data_one_hot[data_words[word]])
                }
            }
            let focus_word = data_one_hot[target_words[0]]
            if (data.length > 0 && focus_word != undefined) {
                let vector_embedding = train(data, focus_word, W1, W2)
                if (vector_embedding.length == 0) {
                    error_words.push(data_words.concat(target_words))
                } else {
                    dict_words[target_words[0]] = vector_embedding
                }
            }
        }
    }
    if(Object.keys(dict_words).length > 0){
        return dict_words
    }
}
let error_words = []
let alpha = 0.001
let data_one_hot = create_onehot('data_NL.txt', "\r\n", 20)
let W1 = crate_W(50, 20)
let W2 = crate_W(20, 50)
let W_c1 = []
let W_c2 = []
let epochs = 1000
let data_test = [
    [1,0,1,0,0,1,0,0,0,1,0,0,1,0,0,0,0,0,0,1],
    [0,1,0,1,1,1,0,0,1,0,1,1,0,1,1,0,1,0,1,0]
]
let focus_word_test = [0,1,1,0,1,0,1,1,1,1,0,0,0,0,1,0,1,1,1,1]
for(let epoch = 0; epoch < epochs; epoch++) {
    alpha = alpha * (1/(1+alpha*epoch))
    let dict_words_save = run(3)
    let hidden_layers_test = average(dot(data_test, W_c1, 'MxM'))
    let output_layers_test = dot([hidden_layers_test], W_c2, 'MxM')
    let output_softmax_test = softmax(output_layers_test[0])
    let loss_test = 0
    let c = 0
    for(let find in focus_word_test){
        if(focus_word_test[find] == 1){
            loss_test += output_softmax_test[find]
            c += 1
        }
    }
    loss_test = -c*loss_test+c*Math.log(sum(exps(output_softmax_test)))
    console.log('Epoch: ', epoch, ' loss: ', loss_test)
    if(epoch == epochs-1){            
        if(Object.keys(dict_words_save).length > 0){
            fs.writeFile('data_vec(10).json', JSON.stringify(dict_words_save), 'utf8', function (err) {
                if (err) {
                    throw err;
                }
                else {
                    console.log('Saved data vecs!');
                }
            });
            fs.writeFile('error_words.txt', JSON.stringify(error_words), 'utf8', function (err) {
                if (err) {
                    throw err;
                }
                else {
                    console.log('Saved data error words!');
                }
            });
        }
    }
}