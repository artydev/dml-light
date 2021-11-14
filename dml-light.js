
/* ----------------------------------------------------------------------------
    global variables
   ---------------------------------------------------------------------------- */

   var _base // Global element stores current insert position. If empty, elements are added at the end of document.
   var _baseStack = [] // Stack for storing _base positions
   var _block = false // global var for blocking loaders
   
   
   function selectBase(ID) {
     // Save old base
     _baseStack.push(_base)
     if (_baseStack.length > 100) {
       alert("DML error: _baseStackOverflow in bushBase()")
       _baseStack = []
     }
     // select new base, either ID or element
     if (typeof (ID) === 'string')
       _base = document.getElementById(ID)
     else
       _base = ID
     return _base
   }
   
   function sb(ID) { selectBase(ID) } // Alias shortcut
   
   /*------------------------------------------------------
     read curent _base
     ------------------------------------------------------*/
   function getBase() {
     return _base
   }
   
   /*------------------------------------------------------
      get current stack position
     ------------------------------------------------------*/
   function DMLgetSP() {
     return _baseStack.length
   }
   
   /*------------------------------------------------------
     set Stackpointer for stored value
     ------------------------------------------------------*/
   function DMLsetSP(SP, msg = "DMLsetSP") {
     if (SP > _baseStack.length)
       alert("Error in " + msg + ", Stack pointer below desired SP")
     else
       while (_baseStack.length > SP)
         _base = _baseStack.pop()
     return _baseStack.length
   }
   
   /*------------------------------------------------------
      check, if current position is equal to chk
      chk is the stacklength before push, gives stack mismatch alert
     ------------------------------------------------------*/
   function DMLchkSP(oldCnt = 0, txt = "Missing unselectBase()") {
     if (DMLgetSP() != oldCnt)
       alert("DML error: _baseStack size mismatch - " + txt + ", before: " + oldCnt + ", after: " + DMLgetSP())
     return _baseStack.length
   }
   
   /*------------------------------------------------------
     Stack-Prüfung für Einzelfunktionen
     f: ()=>{return new construct(xyz) }
     ------------------------------------------------------*/
   function checkSP(f, txt) {
     let sp = DMLgetSP()
     let ret = f()
     DMLchkSP(sp, txt)
     return ret
   }
   
   /*------------------------------------------------------
      restore last base from stack, returns Stack position.
      if cnt set, unselectBase is called cnt times
      oldCnt is provided for test purpose. If SP after unselectBase
      is different, error message is displayed
     ------------------------------------------------------*/
   function unselectBase(cnt = 1, oldCnt = -1, msg = "unselectBase") {
     for (let i = 0; i < cnt; i++) {
       if (_baseStack.length <= 0) {
         alert("DML error: _baseStack empty in popBase()")
         break
       } else
         _base = _baseStack.pop() // restore old stack
   
       if (oldCnt >= 0) {
         if (DMLgetSP() != oldCnt)
           alert("DML error: _baseStack size mismatch - " + msg + ", before: " + oldCnt + ", after: " + DMLgetSP())
       }
     }
     // if chk, check Stacklength after pop == chk
     return _baseStack.length
   }
   
   
   /* ----------------------------------------------------------------------------
      Check, if node is element or string
      create span from string
      if c is object, return Object only
      ----------------------------------------------------------------------------*/
   function chk_node(c) {
     if (typeof (c) == "string") {
       let ret = create("span")
       ret.innerHTML = c
       return ret
       //  return textNode(c)
     } else return c
   }
   
 
   function setAttributes(el, attrib) {
     if (typeof (attrib) == "string") // Check for string attribute          
       attrib = { "style": attrib } // Convert strings to {"style",attrib}
   
     // set attributes
     if (typeof (attrib) == "object") {
       // Slpit JSON, set attributes individually
       Object.keys(attrib).forEach(function (key) {
         let val = attrib[key]
         if (key != "style") {
           el.setAttribute(key, val); // Normal attributes
         } else { // set Style parameters individually
           let ar = val.split(';'); // Split style Elements
           ar.forEach(function (pair) {
             if (pair) { // If not empty    
               let kv = pair.split(":")
               if (kv.length == 2) {
                 let p = kv[0].trim()
                 let v = kv[1].trim()
                 el.style.setProperty(p, v); // Set property
               }
             }
           })
         }
       })
     }
     return (el)
   }
   
   /*------------------------------------------------------
      general short cut function. Creates an element and appends
      to existing object. Type is string like 'div'
     ------------------------------------------------------*/
   function createAt(obj, typ, attrib) {
     let ret = document.createElement(typ)
     setAttributes(ret, attrib)
     obj.appendChild(ret)
     return ret
   }
   
   
   // ----------------------------------------------------------------------------
   // create object with content and attributes. Content can be text or object
   // attrib is an JSON-object {"id":"test", "class": myclass}
   // ----------------------------------------------------------------------------
   function create(typ, attrib, c) {
     let el = document.createElement(typ)
     if (c) {
       if (typeof (c) == 'string') el.innerHTML = c
       else el.appendChild(c); // sicherstellen, daß c objekttyp ist
     }
     if (attrib) { setAttributes(el, attrib) }
     return el
   }
   
   
   // ----------------------------------------------------------------------------
   // Append object at current base
   // ----------------------------------------------------------------------------
   function appendBase(c) {
     let e = chk_node(c)
     if (_base) _base.appendChild(e)
     else {
       // if (document.body) document.body.append(e)
       if (document.body) document.body.appendChild(e)
       else {
         console.log("null Body found: " + c.textContent)
         return
       }
     }
     return (e)
   }
   // ----------------------------------------------------------------------------
   // Append object at current base without check for String
   // ----------------------------------------------------------------------------
   function _appendBase(c) {
     if (_base)
       _base.appendChild(c)
     else
       document.body.append(c)
     return (c)
   }
   
   // ----------------------------------------------------------------------------
   // make: create element with content and appendBase at current base
   // attributes is an JSON-object {"id":"test", "class": myclass}
   // ----------------------------------------------------------------------------
   function make(typ, attrib, c) {
     return appendBase(create(typ, attrib, c))
   }
      
   function br(cnt) { let n = cnt || 1; let br; for (let i = 0; i < n; i++) br = make("br"); return br; } // br() or br(5) for one or multiple linebreaks
   function nbsp(n = 1) {
     let s = "";
     for (let i = 0; i < n; i++) { s += "\xa0" }
     print(s)
   }
   
   function h1(s, attrib) { return make("h1", attrib, s) }
   
   function h2(s, attrib) { return make("h2", attrib, s) }
   
   function h3(s, attrib) { return make("h3", attrib, s) }
   
   function h4(s, attrib) { return make("h4", attrib, s) }
   
   function h5(s, attrib) { return make("h5", attrib, s) }
   
   function h6(s, attrib) { return make("h6", attrib, s) }
   
   function hr(attrib) { return make("hr", attrib) }
   
   function p(s, attrib) { return make("p", attrib, s) }
   // function slider(attrib) { let sl = make("input", attrib); sl.type = "range"; return sl }
   function image(s, attrib) {
     let d = make("img", attrib);
     d.src = s, d.alt = s;
     return d;
   }
   
   function span(s, attrib) { return make("span", attrib, s) }
   
   function link(s, link, attrib) {
     let lnk = make("a", attrib, s);
     lnk.href = link;
     return lnk;
   }
   // Create link
   function pre(s, attrib) { return make("pre", attrib, textNode(s)); } // Unformatted text

 
   function div(s, attrib) {
     return make("div", attrib, s)
   }
   
   function idiv(s, attrib) {
     let d = make("div", attrib, s);
     // if (d) if (d.style)
     d.style.display = "inline-block";
     return d;
   }
   const inlineDiv = idiv; // Alias
   const inlinediv = idiv; // Alias
   
   // Create div and select as base 
   function sdiv(s, attrib) {
     return selectBase(div(s, attrib))
   }
   
   // create idiv and select as base
   function sidiv(s, attrib) {
     return selectBase(idiv(s, attrib))
   }
   
   /*------------------------------------------------------
     Create an overlay with an element of 0 px as an anchor
     returns the reference to the overlaying div
     requires unselectBase(2) 
     ------------------------------------------------------*/
   function overlay(s, attrib) {
     selectBase(div("", "position: relative; width: 0px; height: 0px;"))
     return selectBase(idiv(s, attrib))
   }
   
   
   
   /*------------------------------------------------------
      Create a button
     ------------------------------------------------------*/
   function button(s, attrib) {
     return make("button", attrib, s)
   }
   
   /*------------------------------------------------------
      Round button
     ------------------------------------------------------*/
   function rbutton(s, x, y, diameter, attr) {
     let b = button(s, attr)
     let style = b.style
     b.parentElement.style.position = "relative"
     style.position = "absolute"
     style.left = px(x)
     style.top = px(y)
     style.height = b.style.width = diameter + "px"
     style.borderRadius = trunc(diameter / 2) + "px"
     style.transform = "translate(-50%, -50%)"
     return b
   };
   
   /*------------------------------------------------------
      normal textarea, not expanding
     ------------------------------------------------------*/
   function textarea(content, attrib, placeholder) {
     let ta = make("textarea", attrib);
     if (placeholder) ta.placeholder = placeholder;
     if (content) ta.value = content;
     return ta
   } // multiline text input
   
   /*------------------------------------------------------
      create textarea, that expands vertically
     ------------------------------------------------------*/
   function expandableTextarea(content, attrib, placeholder) {
     let ta = textarea(content, attrib, placeholder)
     setAttributes(ta, {
       "rows": "1",
       "style": /*"border: none; background-color: rgba(0,0,0,0);"+*/ " box-sizing: border-box; overflow: hidden; min-height: 35px"
     })
     setAttributes(ta, attrib)
   
     ta.onchange = ta.onkeyup = ta.doResize = ta.autosize
     ta.autosize()
     // ta.autosize(); // run once on startup
     return ta
   }
   
   /*------------------------------------------------------
       rezise Textarea
     ------------------------------------------------------*/
   HTMLTextAreaElement.prototype.autosize = function () { // Expand Textarea
     let el = this
     setTimeout(function () {
       el.style.height = "22px"
       el.style.height = (el.scrollHeight) + "px"
     }, 1);
   }
   
   
   
   /*------------------------------------------------------
     Add text or element count times to current base 
     count (optional)
     ------------------------------------------------------*/
   function print(s, count = 1) {
     for (let i = 0; i < count; i++) {
       if (typeof (s) == 'string')
         appendBase(s)
       else
         if (i == 0)
           appendBase(s)
         else
           appendBase(s.cloneNode(true))
     }
   }
   
   /*------------------------------------------------------
      Add text or node + br() to the current base
      count (optional)
     ------------------------------------------------------*/
   function println(s, count = 1) {
     for (let i = 0; i < count; i++) {
       print(s)
       br()
     }
   }
   
   // ----------------------------------------------------------------------------
   // Create label with margins. Childbefore will insert element left of label
   // ----------------------------------------------------------------------------
   function label(s, attrib, childbefore) {
     let lbl = make("label", attrib, childbefore)
     if (typeof (s) == "string")
       lbl.appendChild(textNode(s))
     else
       lbl.appendChild(s)
     lbl.style.marginRight = "5px"
     lbl.style.marginLeft = "5px"
     return lbl
   }
   
   
   // ----------------------------------------------------------------------------
   // Create a text of constant width
   // ----------------------------------------------------------------------------
   function blocktext(s, width, attrib) {
     let sp = span(s)
     inlineDiv(sp, attrib).style.width = px(width)
     return (sp)
   }
   
 
   
   /****************************************************************************************
                               Lists   
   ****************************************************************************************/
   /*------------------------------------------------------
     ul()
     Gets array of string or array of object[key] ul([opts])
       ul.items: get or set content
       ul.clear(): Clear list
       ul.add(): Add new elements to the list 
       ul.put(): Clear list befor add
     ------------------------------------------------------*/
   function ul(opts, attrib) {
     let lst = make("ul", attrib)
     lst.items = opts
     return lst
   }
   HTMLUListElement.prototype.add = function (opts) { if (opts) appendChilds(this, "li", opts) }
   HTMLUListElement.prototype.put = function (opts) { this.clear(); if (opts) appendChilds(this, "li", opts) }
   HTMLUListElement.prototype.clear = function () { this.innerHTML = "" }
   
   Object.defineProperty(
     HTMLUListElement.prototype, "items", {
     get: function () {
       let elem, ret = []
       for (let i in this.childNodes) {
         let n = this.childNodes[i]
         elem = n.innerHTML
         ret.push(elem)
       }
       return ret
     },
     set: function (opts) {
       this.clear()
       this.add(opts)
     }
   }
   )
