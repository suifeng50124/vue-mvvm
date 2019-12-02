function Mvvm(option = {}) {
    this.$option = option;
    let data = this._data = this.$option.data;
    observe(data);
    //数据代理
    for(let key in data) {
        Object.defineProperty(this, key, {
            enumerable: true,
            get() {
                return this._data[key];
            },
            set(newVal) {
                this._data[key] = newVal;
            }
        })
    }
}

function observe(data) {
    if (data != null && typeof data === 'object') {
        for(let key in data) {
            let val = data[key];
            observe(val); //递归劫持
            Object.defineProperty(data, key, {
                enumerable: true,
                get() {
                    return val;
                },
                set(newVal) {
                    if (newVal !== val) {
                        val = newVal
                        if (val != null && typeof val === 'object') {
                            observe(val); //新值数据劫持
                        }
                    } else {
                        return;
                    }
                }
            })
        }
    } else {
        return;
    }
}

// function observe(data) {
//     return new Observe(data);
// }

// function Observe(data) {
//     for(let key in data) {
//         let val = data[key];
//         if(val != null && typeof val === 'object') {
//             observe(val);
//         }
//         Object.defineProperty(data, key, {
//             enumerable: true,
//             get() {
//                 return val;
//             },
//             set(newVal) {
//                 if (newVal !== val) {
//                     val = newVal;
//                     if(val != null && typeof val === 'object') {
//                         observe(val)
//                     }
//                 } else {
//                     return;
//                 }
//             }
//         })
//     }
// }