const myModule = require('./arraytrainbot');
let bot = myModule.bot();
const sentences_bot = require('./datasentence')
const sentence_data = sentences_bot.bot()
const sentences_bot_test = require('./datasentence')
const sentence_test = sentences_bot_test.bot()
let bigdata = []
let datatest = []
let learn_rec = {}
function convert_vector(sentence) {
    let text = sentence
    let array_text = text.split(" ")
    let array_check = []
    let vector_text = []
    let lim = 0
    for (var i in bot) {
        let array_i = bot[i].split(" ")
        for (let y in array_i) {
            if (array_text.find(element => element.toLocaleLowerCase() == array_i[y].toLocaleLowerCase()) != undefined) {
                if (array_check.length == 0) {
                    array_check.push(array_i[y])
                    vector_text.push(1)
                } else {
                    if (array_check.find(element => element.toLocaleLowerCase() == array_i[y].toLocaleLowerCase()) != array_i[y].toLocaleLowerCase()) {
                        vector_text.push(1)
                    }
                }
            } else {
                if (array_check.length == 0 && lim < 4) {
                    array_check.push(array_i[y])
                    vector_text.push(0)
                    lim += 1
                } else {
                    if (array_check.find(element => element.toLocaleLowerCase() == array_i[y].toLocaleLowerCase()) != array_i[y].toLocaleLowerCase() && lim < 4) {
                        vector_text.push(0)
                        lim += 1
                    }
                }
            }
        }
    }
    if (vector_text.length > 0) {
        vector_text = vector_text.splice(0, 16)
        for (let i = vector_text.length; i < 16; i++) {
            vector_text.push(0)
        }
        vector_text.push(parseInt(sentence_data[sentence]))
        return vector_text
    }
}

for (let sentence in sentence_data) {
    let vector = convert_vector(sentence)
    bigdata.push(vector)
}

for (let sentence in sentence_test) {
    let vector = convert_vector(sentence)
    datatest.push(vector)
}

async function train(epoch_run, traindata, W) {
    for (var epoch = 0; epoch < epoch_run; epoch++) {
        let tx = []
        for (var i in traindata) {
            let item_matrix = 0
            for (var y in traindata[i]) {
                if (y < 16) {
                    item_matrix += traindata[i][y] * W[y]
                } else {
                    tx.push(item_matrix)
                    item_matrix = 0
                }
            }
        }
        if (tx != null && tx != undefined && tx.length > 0) {

            for (var i in tx) {
                tx[i] = 1 / (1 + Math.exp(-tx[i]))
            }

            let sig = tx
            let loss = []
            for (var item in traindata) {
                let item_loss = []
                for (var y in traindata[item]) {
                    if (y < 16) {
                        item_loss.push(traindata[item][16] - sig[y])
                    }
                    else {
                        loss.push(item_loss)
                        item_loss = []
                    }
                }
            }

            let loss_sig = []
            if (loss.length > 0) {
                for (var x in loss) {
                    let item_loss_sig = []
                    for (var i in loss[x]) {
                        item_loss_sig.push(loss[x][i] * sig[x] * (1 - sig[x]))
                    }
                    if (item_loss_sig != [] && item_loss_sig.length > 0) {
                        loss_sig.push(item_loss_sig)
                        item_loss_sig = []
                    }
                }
            }
            if (loss_sig.length > 0) {
                for (var i in traindata) {
                    for (var y in traindata[i]) {
                        if (y < 16) {
                            W[y] += traindata[i][y] * loss_sig[i][y]
                        }
                    }
                }
            }
        }

        // let item_matrix_pre = 0
        // for (var i in predict) {

        //     item_matrix_pre += -parseFloat(predict[i]) * parseFloat(W[i])
        // }
        // if (item_matrix_pre != 0) { loss_rec.push([epoch, 1 - 1 / (1 + Math.exp(item_matrix_pre))]) }
    }
}

function check_accuracy(W) {
    let accuracy = 0
    for (let vec in datatest) {
        let predict = datatest[vec]
        //console.log(predict)
        let results_pre = 0
        for (var i in predict) {
            if (i < 16) {
                results_pre += -predict[i] * W[i]
            }
        }
        //console.log("Predict: ", 1 / (1 + Math.exp(results_pre)))
        let label = 0
        if (1 / (1 + Math.exp(results_pre)) > 0.5) {
            label = 1
        } else {
            label = 0
        }
        //console.log(label)
        if (datatest[vec][16] == label) {
            accuracy += 1
        } else {
            bigdata.push(datatest[vec])
        }
    }
    if (accuracy != 0) {
        return accuracy
    }
}

function reinforcement_learning(W) {
    train(200, bigdata, W)
    //console.log("W again: ", W)
    let accuracy = check_accuracy(W)    
    if(accuracy != 0){
        return accuracy
    }
}

if (bigdata.length > 0) {
    let traindata = bigdata
    let W = [0.8593953, -0.64283819, -0.17586926, 0.41737434, -0.434623, -0.66179097, 0.02913811, 0.94017845, 0.49047096, -0.58488428, -0.28962489, -0.37330868, -0.00106674, 0.77746725, 0.13501903, -0.28962489]
    train(200, traindata, W)
    //console.log("W train: ", W)
    let accuracy = check_accuracy(W)
    if (accuracy != 0) {
         while (accuracy/datatest.length > 0.8) {
             accuracy = reinforcement_learning(W)
             console.log("accuracy: ", accuracy/datatest.length)
             learn_rec[accuracy/datatest.length] = W
         }
    }
    if(Object.keys(learn_rec).length > 0){
        console.log("learn_rec: ", learn_rec)
    }
}
