```js
const dom = (el) =>  {
    if (typeof(el) == "function") {
        return selectBase(el()) 
    }
    return selectBase(el) 
};

const udom = () => unselectBase();
```