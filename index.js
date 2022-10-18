// @ts-nocheck

const url = "https://dummyjson.com/users?limit=5"

async function fetchUsers () {
    const resp = await fetch(url)
    const json = await resp.json()
    return json
} 

function Dom (obj) {
    if (typeof(obj === "string")) {
        return dom(document.getElementById("obj"))
    }
    else {
        return dom(obj())
    }
}

function App (users) {

    const [ul,li] = [m("ul"), m("li"),m("div")];

    function userCard (user) {
        return `Hy ${user.firstName}`
    }
    
    function usersList (users) {
       return  users.map(u => userCard(u));
    }

    function getTitleApp () {
        return html("<h1>Title</h1>")
    }

    function showUsersList () {
     
        let _users = usersList(users)   

        dom(app)
            let title = getTitleApp();
            let l1 = dom(ul); _users.map(li); udom();
            let l2 = dom(ul); _users.map(li); udom();
            title.style.color = "orange"
            l1.style.border = "1px solid red"
            l2.style.border = "1px solid yellow"
    }
    
    showUsersList()
}

function startApp () {
    fetchUsers()
        .then(resp => App(resp.users));
}

startApp()




