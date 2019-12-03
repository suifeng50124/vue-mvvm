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

    new compile(option.el, this);
}

function observe(data) {
    if (data != null && typeof data === 'object') {
        for(let key in data) {
            let dep = new Dep()
            let val = data[key];
            observe(val); //递归劫持
            Object.defineProperty(data, key, {
                enumerable: true,
                get() {
                    Dep.target && dep.addSub(Dep.target);
                    return val;
                },
                set(newVal) {
                    if (newVal !== val) {
                        val = newVal
                        if (val != null && typeof val === 'object') {
                            observe(val); //新值数据劫持
                        }
                        dep.notify();
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

function compile(el, vm) {
    vm.$el = document.querySelector(el);
    let fragment = document.createDocumentFragment();
    console.log(vm.$el.firstChild)
    while(child = vm.$el.firstChild) { //将APP中的内容存到内存中
        fragment.appendChild(child)
    }
    replace(fragment)
    function replace(fragment) {
        fragment.childNodes.forEach(node => {
            let text = node.textContent;
            console.log(text)
            let reg = /\{\{(.*)\}\}/;
            if (node.nodeType === 3 && reg.test(text)) {
                // let arr = RegExp.$1.split('.'); //获取页面数据属性
                // console.log(arr)
                // let val = vm;
                // arr.forEach(key => {
                //     val = val[key];
                // })
                let val = getProperty(vm, RegExp.$1)
                new Watcher(vm, RegExp.$1, function(newVal){
                    node.textContent = text.replace(reg, newVal);
                })
                node.textContent = text.replace(reg, val);
            }
            if (node.childNodes) {
                replace(node)
            }
        });
    }
    vm.$el.appendChild(fragment); //回写到页面
}



function getProperty(vm, exp) {
    let val = vm;
    let arr = exp.split('.');
    arr.forEach(key => {
        val = val[key]
    })
    return val;
}


//发布、订阅
function Dep() {
    this.subs = [];
}

Dep.prototype.addSub = function(sub) {
    this.subs.push(sub);
}

Dep.prototype.notify = function(sub) {
    this.subs.forEach(sub => sub.update())
}

function Watcher(vm, exp, fn) {
    this.vm = vm;
    this.exp = exp;
    Dep.target = this;
    // let val =vm;
    // let arr = exp.split('.');
    // arr.forEach(key => {
    //     val = val[key]
    // })
    let val = getProperty(vm, exp)
    Dep.target = null;
    this.fn = fn
}

Watcher.prototype.update = function() {
    let val = getProperty(this.vm, this.exp)
    this.fn(val);
}

// let watcher1 = new Watcher(function() {
//     console.log('aa')
// })

// let watcher2 = new Watcher(function() {
//     console.log('bb')
// })

// let dep = new Dep();
// console.log(dep)
// dep.addSub(watcher1)
// dep.addSub(watcher2)
// dep.notify()


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