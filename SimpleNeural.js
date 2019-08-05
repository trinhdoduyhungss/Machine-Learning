// traindata = [input1, input2, input3, output-label]
let traindata = [
    [0, 0, 1, 0],
    [1, 0, 1, 1],
    [1, 1, 1, 1],
    [0, 1, 1, 0],
    [0, 0, 0, 0]
]
let W = [-0.21556766, 0.20178071, 0.36381179] // It is random (1,3)
let predict = [1, 1, 0]
let loss_rec = []
train(200)
function train(epoch_run) {
    for (var epoch = 0; epoch < epoch_run; epoch++) {
        let tx = []
        for (var i in traindata) {
            let item_matrix = 0
            for (var y in traindata[i]) {
                if (y < 3) {
                    item_matrix += traindata[i][y] * W[y] // Output = W1*input1+W2*input2+W3*input3
                } else {
                    tx.push(item_matrix)
                    item_matrix = 0
                }
            }
        }
        if (tx != null && tx != undefined && tx.length > 0) {
            // Sigmoid
            for (var i in tx) {
                tx[i] = 1 / (1 + Math.exp(-tx[i]))
            }
            // Calculator loss = trainlabel - sig
            let sig = tx
            let loss = []
            for (var item in traindata) {
                let item_loss = []
                for (var y in traindata[item]) {
                    if (y < 3) {
                        item_loss.push(traindata[item][3] - sig[y])
                    }
                    else {
                        loss.push(item_loss)
                        item_loss = []
                    }
                }
            }
             // Update Weigth. Adjust weigth by = error*input*output*(1-output). output*(1-output) <=> Sigmoid(output)
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
                        if (y < 3) {
                            W[y] += traindata[i][y] * loss_sig[i][y]
                        }
                    }
                }
            }
        }
        // Loss rec
        let item_matrix_pre = 0
        for(var i in predict){            
            item_matrix_pre += -predict[i] * W[i]
        }
        if(item_matrix_pre != 0){loss_rec.push([epoch,1-1 / (1 + Math.exp(item_matrix_pre))])}
    }
}
console.log("loss_rec: ",loss_rec)
console.log("W: ", W)
let results_pre = 0
for(var i in predict){
    results_pre += -predict[i]*W[i]
}
console.log("Predict: ", 1/(1+Math.exp(results_pre)))